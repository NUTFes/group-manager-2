require 'test_helper'

class RentalOrdersControllerTest < ActionDispatch::IntegrationTest
  setup do
    @rental_order = rental_orders(:one)
  end

  test "should get index" do
    get rental_orders_url, as: :json
    assert_response :success
  end

  test "should create rental_order" do
    assert_difference('RentalOrder.count') do
      post rental_orders_url, params: { rental_order: { group_id: @rental_order.group_id, num: @rental_order.num, rental_item_id: @rental_order.rental_item_id } }, as: :json
    end

    assert_response 201
  end

  test "should show rental_order" do
    get rental_order_url(@rental_order), as: :json
    assert_response :success
  end

  test "should update rental_order" do
    patch rental_order_url(@rental_order), params: { rental_order: { group_id: @rental_order.group_id, num: @rental_order.num, rental_item_id: @rental_order.rental_item_id } }, as: :json
    assert_response 200
  end

  test "should destroy rental_order" do
    assert_difference('RentalOrder.count', -1) do
      delete rental_order_url(@rental_order), as: :json
    end

    assert_response 204
  end
end
