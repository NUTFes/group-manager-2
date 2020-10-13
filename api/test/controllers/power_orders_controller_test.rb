require 'test_helper'

class PowerOrdersControllerTest < ActionDispatch::IntegrationTest
  setup do
    @power_order = power_orders(:one)
  end

  test "should get index" do
    get power_orders_url, as: :json
    assert_response :success
  end

  test "should create power_order" do
    assert_difference('PowerOrder.count') do
      post power_orders_url, params: { power_order: { group_id: @power_order.group_id, item: @power_order.item, manufacture: @power_order.manufacture, model: @power_order.model, power: @power_order.power } }, as: :json
    end

    assert_response 201
  end

  test "should show power_order" do
    get power_order_url(@power_order), as: :json
    assert_response :success
  end

  test "should update power_order" do
    patch power_order_url(@power_order), params: { power_order: { group_id: @power_order.group_id, item: @power_order.item, manufacture: @power_order.manufacture, model: @power_order.model, power: @power_order.power } }, as: :json
    assert_response 200
  end

  test "should destroy power_order" do
    assert_difference('PowerOrder.count', -1) do
      delete power_order_url(@power_order), as: :json
    end

    assert_response 204
  end
end
