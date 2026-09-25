# frozen_string_literal: true

require 'test_helper'
require 'minitest/mock'

# admin_view用のstaff向けエンドポイントが、自団体を持たないstaff/managerでも
# 任意の団体のレコードを操作でき、userロールからは使えないことを検証する
class Api::V1::AdminViewRecordManagementTest < ActionDispatch::IntegrationTest
  self.fixture_table_names = []

  RESOURCES = {
    employee: {
      model: 'Employee',
      record: -> { @employee },
      create_params: lambda {
        { group_id: @other_group.id, name: '新規従業員', student_id: 22_000_001, stool_test_id: @stool_test.id }
      },
      update_params: { name: '更新後の従業員' },
      updated: ->(record) { record.name == '更新後の従業員' }
    },
    public_relation: {
      model: 'PublicRelation',
      record: -> { @public_relation },
      create_params: lambda {
        {
          group_id: @other_group.id,
          picture_name: 'new.png',
          picture_path: 'https://i.imgur.com/new.png',
          blurb: '新規PR文'
        }
      },
      update_params: { blurb: '更新後のPR文' },
      updated: ->(record) { record.blurb == '更新後のPR文' }
    },
    stage_common_option: {
      model: 'StageCommonOption',
      record: -> { @stage_common_option },
      create_params: lambda {
        { group_id: @other_group.id, own_equipment: true, bgm: false, camera_permission: true, loud_sound: false }
      },
      update_params: { bgm: true },
      updated: ->(record) { record.bgm == true }
    },
    place_order: {
      model: 'PlaceOrder',
      record: -> { @place_order },
      create_params: -> { { group_id: @other_group.id, first: 1, second: 2, third: 3, remark: '新規備考' } },
      update_params: { remark: '更新後の備考' },
      updated: ->(record) { record.remark == '更新後の備考' }
    },
    rental_order: {
      model: 'RentalOrder',
      record: -> { @rental_order },
      create_params: -> { { group_id: @other_group.id, rental_item_id: @rental_item.id, num: 3 } },
      update_params: { num: 10 },
      updated: ->(record) { record.num == 10 }
    }
  }.freeze

  setup do
    Role.find_or_create_by!(id: Role::MANAGER_ID) { |role| role.name = 'manager' }
    Role.find_or_create_by!(id: Role::STAFF_ID) { |role| role.name = 'staff' }
    Role.find_or_create_by!(id: Role::USER_ID) { |role| role.name = 'user' }

    @manager = create_user!('admin-view-manager@example.com', Role::MANAGER_ID)
    @staff = create_user!('admin-view-staff@example.com', Role::STAFF_ID)
    @owner = create_user!('admin-view-owner@example.com', Role::USER_ID)
    other_owner = create_user!('admin-view-other-owner@example.com', Role::USER_ID)

    fes_year = FesYear.create!(year_num: 2026)
    @group_category = GroupCategory.create!(name: 'admin view test')
    @group = create_group!('既存団体', @owner, fes_year)
    @other_group = create_group!('別団体', other_owner, fes_year)

    @stool_test = StoolTest.create!(status: '未提出')
    @rental_item = RentalItem.create!(name: '長机')

    @employee = Employee.create!(group: @group, name: '既存従業員', student_id: 22_000_000, stool_test: @stool_test)
    @public_relation = PublicRelation.create!(
      group: @group, picture_name: 'old.png', picture_path: 'https://i.imgur.com/old.png', blurb: '既存PR文'
    )
    @stage_common_option = StageCommonOption.create!(
      group: @group, own_equipment: false, bgm: false, camera_permission: false, loud_sound: false
    )
    @place_order = PlaceOrder.create!(group: @group, first: 1, second: 2, third: 3, remark: '既存備考')
    @rental_order = RentalOrder.create!(group: @group, rental_item: @rental_item, num: 1)
  end

  RESOURCES.each do |name, spec|
    test "staff without an owned group can create a #{name} for any group" do
      assert_difference("#{spec[:model]}.count", 1) do
        post "/api/v1/create_#{name}_for_admin_view",
             params: instance_exec(&spec[:create_params]),
             headers: auth_headers(@staff),
             as: :json
      end

      assert_response :success
      assert_equal 201, response.parsed_body.dig('status', 'code')
      created = spec[:model].constantize.find(response.parsed_body.dig('data', 'id'))
      assert_equal @other_group.id, created.group_id
    end

    test "staff without an owned group can update another group's #{name}" do
      record = instance_exec(&spec[:record])

      patch "/api/v1/update_#{name}_for_admin_view/#{record.id}",
            params: spec[:update_params],
            headers: auth_headers(@staff),
            as: :json

      assert_response :success
      assert spec[:updated].call(record.reload), "#{name} should be updated"
    end

    test "staff without an owned group can delete another group's #{name}" do
      record = instance_exec(&spec[:record])

      assert_difference("#{spec[:model]}.count", -1) do
        delete "/api/v1/delete_#{name}_for_admin_view/#{record.id}", headers: auth_headers(@staff), as: :json
      end

      assert_response :success
    end

    test "#{name} create and update reject a nonexistent group with 422" do
      record = instance_exec(&spec[:record])

      assert_no_difference("#{spec[:model]}.count") do
        post "/api/v1/create_#{name}_for_admin_view",
             params: instance_exec(&spec[:create_params]).merge(group_id: 0),
             headers: auth_headers(@staff),
             as: :json
      end
      assert_response :unprocessable_entity

      patch "/api/v1/update_#{name}_for_admin_view/#{record.id}",
            params: { group_id: 0 },
            headers: auth_headers(@staff),
            as: :json
      assert_response :unprocessable_entity
      assert_equal @group.id, record.reload.group_id
    end

    test "#{name} update and delete return 404 for a nonexistent record" do
      patch "/api/v1/update_#{name}_for_admin_view/0",
            params: spec[:update_params],
            headers: auth_headers(@staff),
            as: :json
      assert_response :not_found

      assert_no_difference("#{spec[:model]}.count") do
        delete "/api/v1/delete_#{name}_for_admin_view/0", headers: auth_headers(@staff), as: :json
      end
      assert_response :not_found
    end

    test "group owner with user role cannot use the admin endpoints for #{name}" do
      record = instance_exec(&spec[:record])

      assert_no_difference("#{spec[:model]}.count") do
        post "/api/v1/create_#{name}_for_admin_view",
             params: instance_exec(&spec[:create_params]).merge(group_id: @group.id),
             headers: auth_headers(@owner),
             as: :json
        assert_response :forbidden

        patch "/api/v1/update_#{name}_for_admin_view/#{record.id}",
              params: spec[:update_params],
              headers: auth_headers(@owner),
              as: :json
        assert_response :forbidden

        delete "/api/v1/delete_#{name}_for_admin_view/#{record.id}", headers: auth_headers(@owner), as: :json
        assert_response :forbidden
      end

      assert_not spec[:updated].call(record.reload), "#{name} should be unchanged"
    end
  end

  test 'admin endpoints require authentication' do
    requests = [[:patch, "/api/v1/update_group_for_admin_view/#{@group.id}"]]
    RESOURCES.each_key do |name|
      requests << [:post, "/api/v1/create_#{name}_for_admin_view"]
      requests << [:patch, "/api/v1/update_#{name}_for_admin_view/1"]
      requests << [:delete, "/api/v1/delete_#{name}_for_admin_view/1"]
    end

    requests.each do |method, path|
      send(method, path, as: :json)
      assert_response :unauthorized, "#{method.upcase} #{path} should require authentication"
    end
  end

  test 'manager can also update another groups record' do
    patch "/api/v1/update_employee_for_admin_view/#{@employee.id}",
          params: { name: 'managerが更新' },
          headers: auth_headers(@manager),
          as: :json

    assert_response :success
    assert_equal 'managerが更新', @employee.reload.name
  end

  test 'staff without an owned group can update any group with query parameters like admin_view' do
    patch "/api/v1/update_group_for_admin_view/#{@group.id}?name=staff%E3%81%8C%E7%B7%A8%E9%9B%86&is_external=true",
          headers: auth_headers(@staff).merge(skip_slack_header),
          as: :json

    assert_response :success
    @group.reload
    assert_equal 'staffが編集', @group.name
    assert @group.is_external
  end

  test 'group update returns 404 for a nonexistent group and 422 for an invalid category' do
    patch '/api/v1/update_group_for_admin_view/0',
          params: { name: 'missing' },
          headers: auth_headers(@staff).merge(skip_slack_header),
          as: :json
    assert_response :not_found

    patch "/api/v1/update_group_for_admin_view/#{@group.id}",
          params: { group_category_id: 0 },
          headers: auth_headers(@staff).merge(skip_slack_header),
          as: :json
    assert_response :unprocessable_entity
    assert_equal @group_category.id, @group.reload.group_category_id
  end

  test 'group owner with user role cannot update a group through the admin endpoint' do
    patch "/api/v1/update_group_for_admin_view/#{@group.id}",
          params: { name: 'userが編集' },
          headers: auth_headers(@owner).merge(skip_slack_header),
          as: :json

    assert_response :forbidden
    assert_equal '既存団体', @group.reload.name
  end

  test 'public relation update deletes the replaced imgur image and hides the deletehash' do
    @public_relation.update!(imgur_deletehash: 'old-deletehash')
    deleted = []

    ImgurImageDeleter.stub(:call, ->(deletehash) { deleted << deletehash }) do
      patch "/api/v1/update_public_relation_for_admin_view/#{@public_relation.id}",
            params: { picture_path: 'https://i.imgur.com/replaced.png', imgur_deletehash: 'new-deletehash' },
            headers: auth_headers(@staff),
            as: :json
    end

    assert_response :success
    assert_equal ['old-deletehash'], deleted
    assert_not response.parsed_body['data'].key?('imgur_deletehash')
    assert_equal 'new-deletehash', @public_relation.reload.imgur_deletehash
  end

  test 'public relation delete also deletes the imgur image' do
    @public_relation.update!(imgur_deletehash: 'old-deletehash')
    deleted = []

    ImgurImageDeleter.stub(:call, ->(deletehash) { deleted << deletehash }) do
      delete "/api/v1/delete_public_relation_for_admin_view/#{@public_relation.id}",
             headers: auth_headers(@staff),
             as: :json
    end

    assert_response :success
    assert_equal ['old-deletehash'], deleted
  end

  private

  def create_user!(email, role_id)
    User.create!(
      name: email.split('@').first,
      email: email,
      uid: email,
      provider: 'email',
      password: 'password',
      password_confirmation: 'password',
      role_id: role_id
    )
  end

  def create_group!(name, user, fes_year)
    Group.create!(
      name: name,
      project_name: "#{name}の企画",
      activity: "#{name}の活動",
      user: user,
      fes_year: fes_year,
      group_category: @group_category
    )
  end

  def auth_headers(user)
    user.create_new_auth_token
  end

  def skip_slack_header
    { 'X-Skip-Slack-Notification' => 'true' }
  end
end
