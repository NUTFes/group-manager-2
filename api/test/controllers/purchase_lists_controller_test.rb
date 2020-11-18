require 'test_helper'

class PurchaseListsControllerTest < ActionDispatch::IntegrationTest
  setup do
    @purchase_list = purchase_lists(:one)
  end

  test "should get index" do
    get purchase_lists_url, as: :json
    assert_response :success
  end

  test "should create purchase_list" do
    assert_difference('PurchaseList.count') do
      post purchase_lists_url, params: { purchase_list: { fes_date_id: @purchase_list.fes_date_id, food_product_id: @purchase_list.food_product_id, is_fresh: @purchase_list.is_fresh, items: @purchase_list.items, shop_id: @purchase_list.shop_id } }, as: :json
    end

    assert_response 201
  end

  test "should show purchase_list" do
    get purchase_list_url(@purchase_list), as: :json
    assert_response :success
  end

  test "should update purchase_list" do
    patch purchase_list_url(@purchase_list), params: { purchase_list: { fes_date_id: @purchase_list.fes_date_id, food_product_id: @purchase_list.food_product_id, is_fresh: @purchase_list.is_fresh, items: @purchase_list.items, shop_id: @purchase_list.shop_id } }, as: :json
    assert_response 200
  end

  test "should destroy purchase_list" do
    assert_difference('PurchaseList.count', -1) do
      delete purchase_list_url(@purchase_list), as: :json
    end

    assert_response 204
  end
end
