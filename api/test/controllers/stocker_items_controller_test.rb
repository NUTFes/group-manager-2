# frozen_string_literal: true

require 'test_helper'

class StockerItemsControllerTest < ActionDispatch::IntegrationTest
  setup do
    @stocker_item = stocker_items(:one)
  end

  test 'should get index' do
    get stocker_items_url, as: :json
    assert_response :success
  end

  test 'should create stocker_item' do
    assert_difference('StockerItem.count') do
      post stocker_items_url, params: { fes_year_id: @stocker_item.fes_year_id, num: @stocker_item.num, rental_item_id: @stocker_item.rental_item_id, stocker_place_id: @stocker_item.stocker_place_id }, as: :json
    end

    assert_response :success
  end

  test 'should show stocker_item' do
    get stocker_item_url(@stocker_item), as: :json
    assert_response :success
  end

  test 'should update stocker_item' do
    patch stocker_item_url(@stocker_item), params: { fes_year_id: @stocker_item.fes_year_id, num: @stocker_item.num, rental_item_id: @stocker_item.rental_item_id, stocker_place_id: @stocker_item.stocker_place_id }, as: :json
    assert_response :ok
  end

  test 'should destroy stocker_item' do
    assert_difference('StockerItem.count', -1) do
      delete stocker_item_url(@stocker_item), as: :json
    end

    assert_response :ok
  end

  test 'should not create stocker_item with invalid params' do
    assert_no_difference('StockerItem.count') do
      post stocker_items_url, params: { rental_item_id: nil, stocker_place_id: nil, fes_year_id: nil }, as: :json
    end
    assert_response :unprocessable_entity
  end

  test 'should not show stocker_item with invalid id' do
    get stocker_item_url(99999), as: :json
    assert_response :not_found
  end

  test 'should not update stocker_item with invalid id' do
    patch stocker_item_url(99999), params: { num: 1 }, as: :json
    assert_response :not_found
  end

  test 'should not destroy stocker_item with invalid id' do
    assert_no_difference('StockerItem.count') do
      delete stocker_item_url(99999), as: :json
    end
    assert_response :not_found
  end
end
