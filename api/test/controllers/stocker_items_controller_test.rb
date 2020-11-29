require 'test_helper'

class StockerItemsControllerTest < ActionDispatch::IntegrationTest
  setup do
    @stocker_item = stocker_items(:one)
  end

  test "should get index" do
    get stocker_items_url, as: :json
    assert_response :success
  end

  test "should create stocker_item" do
    assert_difference('StockerItem.count') do
      post stocker_items_url, params: { stocker_item: { fes_year_id: @stocker_item.fes_year_id, num: @stocker_item.num, rental_item_id: @stocker_item.rental_item_id, stocker_place_id: @stocker_item.stocker_place_id } }, as: :json
    end

    assert_response 201
  end

  test "should show stocker_item" do
    get stocker_item_url(@stocker_item), as: :json
    assert_response :success
  end

  test "should update stocker_item" do
    patch stocker_item_url(@stocker_item), params: { stocker_item: { fes_year_id: @stocker_item.fes_year_id, num: @stocker_item.num, rental_item_id: @stocker_item.rental_item_id, stocker_place_id: @stocker_item.stocker_place_id } }, as: :json
    assert_response 200
  end

  test "should destroy stocker_item" do
    assert_difference('StockerItem.count', -1) do
      delete stocker_item_url(@stocker_item), as: :json
    end

    assert_response 204
  end
end
