# frozen_string_literal: true

require 'test_helper'

class ResubmissionOrderApiTest < ActionDispatch::IntegrationTest
  self.fixture_table_names = []

  setup do
    Role.create!(id: 1, name: 'admin')
    Role.create!(id: 3, name: 'user')
    @user = create_user!(email: 'resubmission-user@example.com')
    @general_user = create_user!(email: 'general-resubmission-user@example.com', role_id: 3)
    @other_user = create_user!(email: 'other-resubmission-user@example.com')
    @group = create_group!(user: @user, name: '再提出団体')
    @other_group = create_group!(user: @other_user, name: '別団体')
  end

  test 'admin power order update does not change submission status' do
    power_order = create_power_order!(@group, item: '変更前')
    submission_status = HealthCenterSubmissionStatus.ensure_for_group_and_application_type!(
      group_id: @group.id,
      application_type: :power_order,
      status: :waiting_resubmission
    )

    put "/api/v1/power_orders/#{power_order.id}",
        params: {
          group_id: @group.id,
          item: '変更後',
          power: 900,
          manufacturer: '管理者',
          model: 'ADMIN-1',
          item_url: 'https://example.com/admin'
        },
        headers: auth_headers(@user).merge('X-Skip-Slack-Notification' => 'true'),
        as: :json

    assert_response :success
    assert_equal '変更後', power_order.reload.item
    assert_equal 'waiting_resubmission', submission_status.reload.status
  end

  test 'admin power order update rejects non admin user' do
    power_order = create_power_order!(@group, item: '変更前')

    put "/api/v1/power_orders/#{power_order.id}",
        params: {
          group_id: @group.id,
          item: '不正更新',
          power: 900,
          manufacturer: '一般ユーザー',
          model: 'USER-1',
          item_url: 'https://example.com/user'
        },
        headers: auth_headers(@general_user).merge('X-Skip-Slack-Notification' => 'true'),
        as: :json

    assert_response :forbidden
    assert_equal '変更前', power_order.reload.item
  end

  test 'admin health center submission status rejects non admin user' do
    post '/api/v1/health_center_submission_statuses',
         params: {
           group_id: @group.id,
           application_type: 'power_order',
           status: 'approved'
         },
         headers: auth_headers(@general_user).merge('X-Skip-Slack-Notification' => 'true'),
         as: :json

    assert_response :forbidden
    assert_nil HealthCenterSubmissionStatus.find_by(group: @group, application_type: :power_order)
  end

  test 'admin power order update returns not found for unknown id' do
    put '/api/v1/power_orders/999999',
        params: {
          group_id: @group.id,
          item: '変更後',
          power: 900,
          manufacturer: '管理者',
          model: 'ADMIN-1',
          item_url: 'https://example.com/admin'
        },
        headers: auth_headers(@user).merge('X-Skip-Slack-Notification' => 'true'),
        as: :json

    assert_response :not_found
  end

  test 'admin power order update returns unprocessable entity for invalid params' do
    power_order = create_power_order!(@group, item: '変更前')

    put "/api/v1/power_orders/#{power_order.id}",
        params: {
          group_id: nil,
          item: '変更後',
          power: 900,
          manufacturer: '管理者',
          model: 'ADMIN-1',
          item_url: 'https://example.com/admin'
        },
        headers: auth_headers(@user).merge('X-Skip-Slack-Notification' => 'true'),
        as: :json

    assert_response :unprocessable_entity
    assert_equal @group.id, power_order.reload.group_id
  end

  test 'admin fire equipment order update does not change submission status' do
    fire_equipment_order = create_fire_equipment_order!(@group, name: '変更前')
    submission_status = HealthCenterSubmissionStatus.ensure_for_group_and_application_type!(
      group_id: @group.id,
      application_type: :fire_equipment_order,
      status: :waiting_resubmission
    )

    put "/api/v1/fire_equipment_orders/#{fire_equipment_order.id}",
        params: {
          fire_equipment_order: {
            group_id: @group.id,
            name: '変更後',
            quantity: 2,
            fuel: 'lp_gas',
            usage: '管理者修正',
            is_takeaway: true,
            remark: 'admin'
          }
        },
        headers: auth_headers(@user).merge('X-Skip-Slack-Notification' => 'true'),
        as: :json

    assert_response :success
    assert_equal '変更後', fire_equipment_order.reload.name
    assert_equal 'waiting_resubmission', submission_status.reload.status
  end

  test 'user resubmits power orders and updates status in one request' do
    power_order = create_power_order!(@group, item: '変更前')
    submission_status = HealthCenterSubmissionStatus.ensure_for_group_and_application_type!(
      group_id: @group.id,
      application_type: :power_order,
      status: :waiting_resubmission
    )
    UnRegisteredGroup.create!(group: @group, order_type: :power_order)

    put '/power_orders/resubmit',
        params: {
          group_id: @group.id,
          use_power: true,
          power_orders: [
            {
              id: power_order.id,
              item: '変更後',
              power: 1000,
              manufacturer: '参加団体',
              model: 'USER-1',
              item_url: 'https://example.com/user'
            }
          ]
        },
        headers: auth_headers(@user).merge('X-Skip-Slack-Notification' => 'true'),
        as: :json

    assert_response :success
    assert_equal '変更後', power_order.reload.item
    assert_equal 'unapproved', submission_status.reload.status
    assert_empty UnRegisteredGroup.where(group: @group, order_type: :power_order)
  end

  test 'user cannot resubmit power order unless status is waiting resubmission' do
    power_order = create_power_order!(@group, item: '変更前')
    submission_status = HealthCenterSubmissionStatus.ensure_for_group_and_application_type!(
      group_id: @group.id,
      application_type: :power_order,
      status: :approved
    )

    put '/power_orders/resubmit',
        params: {
          group_id: @group.id,
          use_power: true,
          power_orders: [
            {
              id: power_order.id,
              item: '変更後',
              power: 1000,
              manufacturer: '参加団体',
              model: 'USER-1',
              item_url: 'https://example.com/user'
            }
          ]
        },
        headers: auth_headers(@user).merge('X-Skip-Slack-Notification' => 'true'),
        as: :json

    assert_response :unprocessable_entity
    assert_equal '変更前', power_order.reload.item
    assert_equal 'approved', submission_status.reload.status
  end

  test 'user resubmits no power application in one request' do
    create_power_order!(@group)
    submission_status = HealthCenterSubmissionStatus.ensure_for_group_and_application_type!(
      group_id: @group.id,
      application_type: :power_order,
      status: :waiting_resubmission
    )

    put '/power_orders/resubmit',
        params: {
          group_id: @group.id,
          use_power: false,
          power_orders: []
        },
        headers: auth_headers(@user).merge('X-Skip-Slack-Notification' => 'true'),
        as: :json

    assert_response :success
    assert_empty PowerOrder.where(group: @group)
    assert UnRegisteredGroup.exists?(group: @group, order_type: :power_order)
    assert_equal 'unapproved', submission_status.reload.status
  end

  test 'user power resubmit rolls back order update when another users order is included' do
    power_order = create_power_order!(@group, item: '変更前')
    other_power_order = create_power_order!(@other_group, item: '別団体')
    submission_status = HealthCenterSubmissionStatus.ensure_for_group_and_application_type!(
      group_id: @group.id,
      application_type: :power_order,
      status: :waiting_resubmission
    )

    put '/power_orders/resubmit',
        params: {
          group_id: @group.id,
          use_power: true,
          power_orders: [
            {
              id: power_order.id,
              item: '変更後',
              power: 1000,
              manufacturer: '参加団体',
              model: 'USER-1',
              item_url: 'https://example.com/user'
            },
            {
              id: other_power_order.id,
              item: '不正更新',
              power: 500,
              manufacturer: '別',
              model: 'OTHER-1',
              item_url: 'https://example.com/other'
            }
          ]
        },
        headers: auth_headers(@user).merge('X-Skip-Slack-Notification' => 'true'),
        as: :json

    assert_response :not_found
    assert_equal '変更前', power_order.reload.item
    assert_equal '別団体', other_power_order.reload.item
    assert_equal 'waiting_resubmission', submission_status.reload.status
  end

  test 'user resubmits fire equipment order and updates status in one request' do
    fire_equipment_order = create_fire_equipment_order!(@group, name: '変更前')
    submission_status = HealthCenterSubmissionStatus.ensure_for_group_and_application_type!(
      group_id: @group.id,
      application_type: :fire_equipment_order,
      status: :waiting_resubmission
    )

    put '/fire_equipment_orders/resubmit',
        params: {
          group_id: @group.id,
          id: fire_equipment_order.id,
          use_fire_equipment: true,
          fire_equipment_order: {
            name: '変更後',
            quantity: 3,
            fuel: 'charcoal',
            usage: '調理',
            is_takeaway: false,
            remark: 'user'
          }
        },
        headers: auth_headers(@user).merge('X-Skip-Slack-Notification' => 'true'),
        as: :json

    assert_response :success
    assert_equal '変更後', fire_equipment_order.reload.name
    assert_equal 'unapproved', submission_status.reload.status
  end

  test 'user resubmits no fire equipment application in one request' do
    fire_equipment_order = create_fire_equipment_order!(@group, name: '変更前')
    submission_status = HealthCenterSubmissionStatus.ensure_for_group_and_application_type!(
      group_id: @group.id,
      application_type: :fire_equipment_order,
      status: :waiting_resubmission
    )

    put '/fire_equipment_orders/resubmit',
        params: {
          group_id: @group.id,
          id: fire_equipment_order.id,
          use_fire_equipment: false
        },
        headers: auth_headers(@user).merge('X-Skip-Slack-Notification' => 'true'),
        as: :json

    assert_response :success
    fire_equipment_order.reload
    assert_equal '', fire_equipment_order.name
    assert_equal 0, fire_equipment_order.quantity
    assert_equal 'unapproved', submission_status.reload.status
  end

  test 'user cannot resubmit fire equipment order unless status is waiting resubmission' do
    fire_equipment_order = create_fire_equipment_order!(@group, name: '変更前')
    submission_status = HealthCenterSubmissionStatus.ensure_for_group_and_application_type!(
      group_id: @group.id,
      application_type: :fire_equipment_order,
      status: :approved
    )

    put '/fire_equipment_orders/resubmit',
        params: {
          group_id: @group.id,
          id: fire_equipment_order.id,
          use_fire_equipment: true,
          fire_equipment_order: {
            name: '変更後',
            quantity: 3,
            fuel: 'charcoal',
            usage: '調理',
            is_takeaway: false,
            remark: 'user'
          }
        },
        headers: auth_headers(@user).merge('X-Skip-Slack-Notification' => 'true'),
        as: :json

    assert_response :unprocessable_entity
    assert_equal '変更前', fire_equipment_order.reload.name
    assert_equal 'approved', submission_status.reload.status
  end

  test 'user cannot resubmit another users fire equipment order' do
    other_fire_equipment_order = create_fire_equipment_order!(@other_group, name: '別団体')
    HealthCenterSubmissionStatus.ensure_for_group_and_application_type!(
      group_id: @group.id,
      application_type: :fire_equipment_order,
      status: :waiting_resubmission
    )

    put '/fire_equipment_orders/resubmit',
        params: {
          group_id: @group.id,
          id: other_fire_equipment_order.id,
          use_fire_equipment: true,
          fire_equipment_order: {
            name: '不正更新',
            quantity: 3,
            fuel: 'charcoal',
            usage: '調理',
            is_takeaway: false,
            remark: 'user'
          }
        },
        headers: auth_headers(@user).merge('X-Skip-Slack-Notification' => 'true'),
        as: :json

    assert_response :not_found
    assert_equal '別団体', other_fire_equipment_order.reload.name
  end

  private

  def create_user!(email:, role_id: 1)
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

  def create_group!(user:, name:)
    group_category = GroupCategory.create!(name: "#{name}カテゴリ")
    fes_year = FesYear.create!(year_num: 2026)
    Group.create!(
      name: name,
      project_name: "#{name}企画",
      activity: '食品販売',
      user: user,
      group_category: group_category,
      fes_year: fes_year
    )
  end

  def create_power_order!(group, item: 'ホットプレート')
    PowerOrder.create!(
      group: group,
      item: item,
      power: 800,
      manufacturer: 'メーカー',
      model: 'MODEL-1',
      item_url: 'https://example.com/item'
    )
  end

  def create_fire_equipment_order!(group, name: 'カセットコンロ')
    FireEquipmentOrder.create!(
      group: group,
      name: name,
      quantity: 1,
      fuel: :gas_bottle,
      usage: '調理',
      is_takeaway: false,
      remark: ''
    )
  end

  def auth_headers(user)
    user.create_new_auth_token
  end
end
