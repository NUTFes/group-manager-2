# frozen_string_literal: true

require 'test_helper'

class StockerItemsControllerTest < ActionDispatch::IntegrationTest
  setup do
    @stocker_item = stocker_items(:one)
  end

  test 'should get index' do
    get stocker_items_url, headers: api_auth_headers, as: :json
    assert_response :success
  end

  test 'should create stocker_item' do
    assert_difference('StockerItem.count') do
      post stocker_items_url, headers: api_auth_headers, params: { stocker_item: { fes_year_id: @stocker_item.fes_year_id, num: @stocker_item.num, rental_item_id: @stocker_item.rental_item_id, stocker_place_id: @stocker_item.stocker_place_id } }, as: :json
    end

    assert_response :created
  end

  test 'should show stocker_item' do
    get stocker_item_url(@stocker_item), headers: api_auth_headers, as: :json
    assert_response :success
  end

  test 'should update stocker_item' do
    patch stocker_item_url(@stocker_item), headers: api_auth_headers, params: { stocker_item: { fes_year_id: @stocker_item.fes_year_id, num: @stocker_item.num, rental_item_id: @stocker_item.rental_item_id, stocker_place_id: @stocker_item.stocker_place_id } }, as: :json
    assert_response :ok
  end

  test 'should destroy stocker_item' do
    assert_difference('StockerItem.count', -1) do
      delete stocker_item_url(@stocker_item), headers: api_auth_headers, as: :json
    end

    assert_response :no_content
  end
end
