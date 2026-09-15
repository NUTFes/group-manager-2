# frozen_string_literal: true

require 'test_helper'

class PlaceOrdersControllerTest < ActionDispatch::IntegrationTest
  setup do
    @place_order = place_orders(:one)

    Role.find_or_create_by!(id: 3) { |role| role.name = 'user' }
    @user = create_user!(email: 'user-place-order@example.com', role_id: 3)
    @headers = auth_headers(@user)
  end

  test 'should get index' do
    get place_orders_url, headers: @headers, as: :json
    assert_response :success
  end

  test 'should create place_order' do
    assert_difference('PlaceOrder.count') do
      post place_orders_url, params: { place_order: { first: @place_order.first, group_id: @place_order.group_id, remark: @place_order.remark, second: @place_order.second, third: @place_order.third } }, headers: @headers, as: :json
    end

    assert_response :created
  end

  test 'should show place_order' do
    get place_order_url(@place_order), headers: @headers, as: :json
    assert_response :success
  end

  test 'should update place_order' do
    patch place_order_url(@place_order), params: { place_order: { first: @place_order.first, group_id: @place_order.group_id, remark: @place_order.remark, second: @place_order.second, third: @place_order.third } }, headers: @headers, as: :json
    assert_response :ok
  end

  test 'should destroy place_order' do
    assert_difference('PlaceOrder.count', -1) do
      delete place_order_url(@place_order), headers: @headers, as: :json
    end

    assert_response :no_content
  end

  test 'index requires authentication' do
    get place_orders_url, as: :json
    assert_response :unauthorized
  end

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

  def auth_headers(user)
    user.create_new_auth_token
  end
end
