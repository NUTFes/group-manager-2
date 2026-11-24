# frozen_string_literal: true

require 'test_helper'

class PlaceOrdersControllerTest < ActionDispatch::IntegrationTest
  self.fixture_table_names = []

  setup do
    Role.find_or_create_by!(id: 1) { |role| role.name = 'admin' }
    Role.find_or_create_by!(id: 3) { |role| role.name = 'user' }

    @admin = create_user!(email: 'admin-place-order@example.com', role_id: 1)
    @user = create_user!(email: 'user-place-order@example.com', role_id: 3)
    @other_user = create_user!(email: 'other-place-order@example.com', role_id: 3)

    @group = create_group!(@user, name: '自団体')
    @other_group = create_group!(@other_user, name: '他団体')

    @place_order = create_place_order!(@group)
    @other_place_order = create_place_order!(@other_group)
  end

  test 'index requires authentication' do
    get place_orders_url, as: :json
    assert_response :unauthorized
  end

  # 全件を返す一覧はuserの画面から呼ばれないため管理画面向け
  test 'index is forbidden for a regular user' do
    get place_orders_url, headers: auth_headers(@user), as: :json
    assert_response :forbidden
  end

  test 'index returns all place_orders for an admin' do
    get place_orders_url, headers: auth_headers(@admin), as: :json
    assert_response :success

    ids = response.parsed_body['data'].pluck('id')
    assert_includes ids, @place_order.id
    assert_includes ids, @other_place_order.id
  end

  test 'admin can show any place_order' do
    get place_order_url(@other_place_order), headers: auth_headers(@admin), as: :json
    assert_response :success
  end

  # show はuserの画面から呼ばれないため、自団体のものでも参照できない
  test 'show of own place_order is forbidden for a regular user' do
    get place_order_url(@place_order), headers: auth_headers(@user), as: :json
    assert_response :forbidden
  end

  test 'show does not expose another group place_order' do
    get place_order_url(@other_place_order), headers: auth_headers(@user), as: :json
    assert_response :forbidden
  end

  test 'show of a nonexistent place_order is forbidden for user' do
    get place_order_url(PlaceOrder.maximum(:id) + 1), headers: auth_headers(@user), as: :json
    assert_response :forbidden
  end

  test 'should create place_order for own group' do
    assert_difference('PlaceOrder.count') do
      post place_orders_url,
           params: { place_order: place_order_params(group: @group) },
           headers: auth_headers(@user), as: :json
    end

    assert_response :success
    assert_equal 201, response.parsed_body['status']['code']
  end

  test 'create is forbidden for another group' do
    assert_no_difference('PlaceOrder.count') do
      post place_orders_url,
           params: { place_order: place_order_params(group: @other_group) },
           headers: auth_headers(@user), as: :json
    end

    assert_response :forbidden
  end

  test 'admin can create place_order for any group' do
    assert_difference('PlaceOrder.count') do
      post place_orders_url,
           params: { place_order: place_order_params(group: @other_group) },
           headers: auth_headers(@admin), as: :json
    end

    assert_response :success
    assert_equal 201, response.parsed_body['status']['code']
  end

  test 'should update own place_order' do
    patch place_order_url(@place_order),
          params: { place_order: place_order_params(group: @group, remark: '更新後') },
          headers: auth_headers(@user), as: :json
    assert_response :ok
  end

  test 'update another group place_order by id is forbidden' do
    patch place_order_url(@other_place_order),
          params: { place_order: place_order_params(group: @other_group, remark: '更新後') },
          headers: auth_headers(@user), as: :json
    assert_response :forbidden
  end

  test 'partial update without group_id is allowed for the owner' do
    patch place_order_url(@place_order),
          params: { place_order: { remark: '備考のみ更新' } },
          headers: auth_headers(@user), as: :json
    assert_response :ok
    assert_equal '備考のみ更新', response.parsed_body['data']['remark']
  end

  test 'reassigning own place_order to another group_id is forbidden' do
    patch place_order_url(@place_order),
          params: { place_order: place_order_params(group: @other_group, remark: '乗っ取り') },
          headers: auth_headers(@user), as: :json
    assert_response :forbidden
  end

  test 'admin can destroy place_order' do
    assert_difference('PlaceOrder.count', -1) do
      delete place_order_url(@place_order), headers: auth_headers(@admin), as: :json
    end

    assert_response :ok
  end

  test 'destroy another group place_order by id is forbidden' do
    assert_no_difference('PlaceOrder.count') do
      delete place_order_url(@other_place_order), headers: auth_headers(@user), as: :json
    end

    assert_response :forbidden
  end

  test 'get_by_group_id returns own group place_order' do
    get "/place_orders/group/#{@group.id}", headers: auth_headers(@user), as: :json
    assert_response :success
  end

  test 'get_by_group_id returns not found when own group has no place_order' do
    group_without_place_order = create_group!(@user, name: '会場申請未登録団体')

    get "/place_orders/group/#{group_without_place_order.id}", headers: auth_headers(@user), as: :json

    assert_response :success
    assert_equal 404, response.parsed_body.dig('status', 'code')
  end

  test 'get_by_group_id does not expose another group place_order' do
    get "/place_orders/group/#{@other_group.id}", headers: auth_headers(@user), as: :json
    assert_response :forbidden
  end

  private

  def create_user!(email:, role_id:)
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

  def create_group!(user, name:)
    group_category = GroupCategory.create!(name: "#{name}カテゴリ")
    fes_year = FesYear.create!(year_num: 2026)
    Group.create!(
      name: name,
      project_name: "#{name}企画",
      activity: '会場申請',
      user: user,
      group_category: group_category,
      fes_year: fes_year
    )
  end

  def create_place_order!(group)
    PlaceOrder.create!(place_order_params(group: group))
  end

  def place_order_params(group:, remark: '既存')
    {
      group_id: group.id,
      first: 1,
      second: 1,
      third: 1,
      remark: remark
    }
  end

  def auth_headers(user)
    user.create_new_auth_token.merge('Content-Type' => 'application/json')
  end
end
