require 'test_helper'

class PlaceOrdersControllerTest < ActionDispatch::IntegrationTest
  setup do
    @place_order = place_orders(:one)
  end

  test "should get index" do
    get place_orders_url, as: :json
    assert_response :success
  end

  test "should create place_order" do
    assert_difference('PlaceOrder.count') do
      post place_orders_url, params: { place_order: { first: @place_order.first, group_id: @place_order.group_id, remark: @place_order.remark, second: @place_order.second, third: @place_order.third } }, as: :json
    end

    assert_response 201
  end

  test "should show place_order" do
    get place_order_url(@place_order), as: :json
    assert_response :success
  end

  test "should update place_order" do
    patch place_order_url(@place_order), params: { place_order: { first: @place_order.first, group_id: @place_order.group_id, remark: @place_order.remark, second: @place_order.second, third: @place_order.third } }, as: :json
    assert_response 200
  end

  test "should destroy place_order" do
    assert_difference('PlaceOrder.count', -1) do
      delete place_order_url(@place_order), as: :json
    end

    assert_response 204
  end
end
