require 'test_helper'

class AssignRentalItemsControllerTest < ActionDispatch::IntegrationTest
  setup do
    @assign_rental_item = assign_rental_items(:one)
  end

  test "should get index" do
    get assign_rental_items_url, as: :json
    assert_response :success
  end

  test "should create assign_rental_item" do
    assert_difference('AssignRentalItem.count') do
      post assign_rental_items_url, params: { assign_rental_item: { num: @assign_rental_item.num, rentable_item_id: @assign_rental_item.rentable_item_id, rental_order_id: @assign_rental_item.rental_order_id } }, as: :json
    end

    assert_response 201
  end

  test "should show assign_rental_item" do
    get assign_rental_item_url(@assign_rental_item), as: :json
    assert_response :success
  end

  test "should update assign_rental_item" do
    patch assign_rental_item_url(@assign_rental_item), params: { assign_rental_item: { num: @assign_rental_item.num, rentable_item_id: @assign_rental_item.rentable_item_id, rental_order_id: @assign_rental_item.rental_order_id } }, as: :json
    assert_response 200
  end

  test "should destroy assign_rental_item" do
    assert_difference('AssignRentalItem.count', -1) do
      delete assign_rental_item_url(@assign_rental_item), as: :json
    end

    assert_response 204
  end
end
