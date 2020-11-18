require 'test_helper'

class FoodProductsControllerTest < ActionDispatch::IntegrationTest
  setup do
    @food_product = food_products(:one)
  end

  test "should get index" do
    get food_products_url, as: :json
    assert_response :success
  end

  test "should create food_product" do
    assert_difference('FoodProduct.count') do
      post food_products_url, params: { food_product: { first_day_num: @food_product.first_day_num, group_id: @food_product.group_id, is_cooking: @food_product.is_cooking, name: @food_product.name, second_day_num: @food_product.second_day_num } }, as: :json
    end

    assert_response 201
  end

  test "should show food_product" do
    get food_product_url(@food_product), as: :json
    assert_response :success
  end

  test "should update food_product" do
    patch food_product_url(@food_product), params: { food_product: { first_day_num: @food_product.first_day_num, group_id: @food_product.group_id, is_cooking: @food_product.is_cooking, name: @food_product.name, second_day_num: @food_product.second_day_num } }, as: :json
    assert_response 200
  end

  test "should destroy food_product" do
    assert_difference('FoodProduct.count', -1) do
      delete food_product_url(@food_product), as: :json
    end

    assert_response 204
  end
end
