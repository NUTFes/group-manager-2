# frozen_string_literal: true

require 'test_helper'

class PowerOrdersControllerTest < ActionDispatch::IntegrationTest
  self.fixture_table_names = []

  setup do
    Role.create!(id: 1, name: 'admin')
    @user = create_user!
    @group = create_group!(@user)
    @power_order = create_power_order!(@group)
  end

  test 'should get index' do
    get power_orders_url, headers: auth_headers(@user), as: :json
    assert_response :success
  end

  test 'should show power_order' do
    get power_order_url(@power_order), headers: auth_headers(@user), as: :json
    assert_response :success
  end

  test 'index requires authentication' do
    get power_orders_url, as: :json
    assert_response :unauthorized
  end

  test 'show does not expose another users power order' do
    other_user = create_user!(email: 'other-power-order-user@example.com')
    other_group = create_group!(other_user, name: '他団体')
    other_power_order = create_power_order!(other_group)

    get power_order_url(other_power_order), headers: auth_headers(@user), as: :json
    assert_response :success
    assert_equal 404, response.parsed_body['status']['code']
  end

  test 'create route is not available for user root api' do
    assert_raises(ActionController::RoutingError) do
      post power_orders_url,
           params: power_order_params(item: '新規'),
           headers: auth_headers(@user),
           as: :json
    end
  end

  test 'update route is not available for user root api' do
    assert_raises(ActionController::RoutingError) do
      patch power_order_url(@power_order),
            params: power_order_params(item: '更新後'),
            headers: auth_headers(@user),
            as: :json
    end
  end

  test 'destroy route is not available for user root api' do
    assert_raises(ActionController::RoutingError) do
      delete power_order_url(@power_order), as: :json
    end
  end

  private

  def create_user!(email: 'power-order-user@example.com')
    User.create!(
      name: email.split('@').first,
      email: email,
      uid: email,
      provider: 'email',
      password: 'password',
      password_confirmation: 'password',
      role_id: 1
    )
  end

  def create_group!(user, name: '電力団体')
    group_category = GroupCategory.create!(name: "#{name}カテゴリ")
    fes_year = FesYear.create!(year_num: 2026)
    Group.create!(
      name: name,
      project_name: '電力企画',
      activity: '食品販売',
      user: user,
      group_category: group_category,
      fes_year: fes_year
    )
  end

  def create_power_order!(group)
    PowerOrder.create!(power_order_params(group: group))
  end

  def power_order_params(group: @group, item: '既存')
    {
      group_id: group.id,
      item: item,
      power: 100,
      manufacturer: 'メーカー',
      model: 'MODEL-1',
      item_url: 'https://example.com'
    }
  end

  def auth_headers(user)
    user.create_new_auth_token.merge('Content-Type' => 'application/json')
  end
end
