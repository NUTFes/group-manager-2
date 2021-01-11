require 'test_helper'

class RentableItemsControllerTest < ActionDispatch::IntegrationTest
  setup do
    @rentable_item = rentable_items(:one)
  end

  test "should get index" do
    get rentable_items_url, as: :json
    assert_response :success
  end

  test "should create rentable_item" do
    assert_difference('RentableItem.count') do
      post rentable_items_url, params: { rentable_item: { max_num: @rentable_item.max_num, stocker_item_id: @rentable_item.stocker_item_id, stocker_place_id: @rentable_item.stocker_place_id } }, as: :json
    end

    assert_response 201
  end

  test "should show rentable_item" do
    get rentable_item_url(@rentable_item), as: :json
    assert_response :success
  end

  test "should update rentable_item" do
    patch rentable_item_url(@rentable_item), params: { rentable_item: { max_num: @rentable_item.max_num, stocker_item_id: @rentable_item.stocker_item_id, stocker_place_id: @rentable_item.stocker_place_id } }, as: :json
    assert_response 200
  end

  test "should destroy rentable_item" do
    assert_difference('RentableItem.count', -1) do
      delete rentable_item_url(@rentable_item), as: :json
    end

    assert_response 204
  end
end
