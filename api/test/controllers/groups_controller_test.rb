# frozen_string_literal: true

require 'test_helper'

class GroupsControllerTest < ActionDispatch::IntegrationTest
  self.fixture_table_names = []

  setup do
    Role.find_or_create_by!(id: Role::MANAGER_ID) { |role| role.name = 'manager' }
    Role.find_or_create_by!(id: Role::USER_ID) { |role| role.name = 'user' }
    @manager = create_user!('manager-groups-controller@example.com', Role::MANAGER_ID)
    @user = create_user!('user-groups-controller@example.com', Role::USER_ID)
    @other_user = create_user!('other-user-groups-controller@example.com', Role::USER_ID)
    @fes_year = FesYear.create!(year_num: 2026)
    @group_category = GroupCategory.create!(name: 'test category')
    @group = Group.create!(
      name: 'Test group',
      project_name: 'Test project',
      activity: 'Test activity',
      user: @user,
      fes_year: @fes_year,
      group_category: @group_category
    )
  end

  test 'should get index' do
    get groups_url, headers: auth_headers(@manager), as: :json
    assert_response :success
  end

  test 'should create group' do
    assert_difference('Group.count') do
      post groups_url,
           params: group_params.merge(name: 'Created group'),
           headers: auth_headers(@user).merge(skip_slack_header),
           as: :json
    end

    assert_response :success
  end

  test 'should show group' do
    get group_url(@group), headers: auth_headers(@user), as: :json
    assert_response :success
  end

  test 'should update group' do
    patch group_url(@group),
          params: group_params.merge(name: 'Updated group'),
          headers: auth_headers(@user).merge(skip_slack_header),
          as: :json

    assert_response :success
    assert_equal 'Updated group', @group.reload.name
  end

  test 'user cannot access another users group' do
    other_group = Group.create!(
      name: 'Other group',
      project_name: 'Other project',
      activity: 'Other activity',
      user: @other_user,
      fes_year: @fes_year,
      group_category: @group_category
    )

    get group_url(other_group), headers: auth_headers(@user), as: :json
    assert_response :not_found

    patch group_url(other_group),
          params: { name: 'Stolen group' },
          headers: auth_headers(@user).merge(skip_slack_header),
          as: :json
    assert_response :not_found
    assert_equal 'Other group', other_group.reload.name
  end

  test 'create ignores a supplied user id' do
    assert_difference -> { @user.groups.count }, 1 do
      assert_no_difference -> { @other_user.groups.count } do
        post groups_url,
             params: group_params.merge(name: 'Owned group', user_id: @other_user.id),
             headers: auth_headers(@user).merge(skip_slack_header),
             as: :json
      end
    end

    assert_response :success
  end

  test 'should destroy group' do
    assert_difference('Group.count', -1) do
      delete group_url(@group),
             headers: auth_headers(@manager).merge(skip_slack_header),
             as: :json
    end

    assert_response :success
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

  def group_params
    {
      activity: @group.activity,
      fes_year_id: @group.fes_year_id,
      group_category_id: @group.group_category_id,
      project_name: @group.project_name,
      user_id: @user.id
    }
  end

  def auth_headers(user)
    user.create_new_auth_token
  end

  def skip_slack_header
    { 'X-Skip-Slack-Notification' => 'true' }
  end
end
