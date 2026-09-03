# frozen_string_literal: true

require 'test_helper'

class RentalOrdersControllerTest < ActionDispatch::IntegrationTest
  # NOTE: 一部の既存フィクスチャ（employees, assign_rental_items 等）が
  # スキーマと乖離しており fixtures :all のままだと setup 時点で読み込みに失敗するため、
  # このテストに必要なフィクスチャのみに限定する。
  self.fixture_table_names = %w[groups rental_items rental_orders]

  setup do
    @rental_order = rental_orders(:one)
  end

  test 'should get index' do
    get rental_orders_url, as: :json
    assert_response :success
  end

  test 'should create rental_order' do
    assert_difference('RentalOrder.count') do
      post rental_orders_url, params: { group_id: @rental_order.group_id, num: @rental_order.num, rental_item_id: @rental_order.rental_item_id }, as: :json
    end

    assert_response :ok
  end

  test 'should not create rental_order with invalid rental_item_id' do
    assert_no_difference('RentalOrder.count') do
      post rental_orders_url, params: { group_id: @rental_order.group_id, num: @rental_order.num, rental_item_id: 0 }, as: :json
    end

    assert_response :unprocessable_entity
    body = response.parsed_body
    assert_includes body['status']['option'], 'Rental item'
  end

  test 'should show rental_order' do
    get rental_order_url(@rental_order), as: :json
    assert_response :success
  end

  test 'should update rental_order' do
    patch rental_order_url(@rental_order), params: { group_id: @rental_order.group_id, num: @rental_order.num, rental_item_id: @rental_order.rental_item_id }, as: :json
    assert_response :ok
  end

  test 'should not update rental_order with invalid rental_item_id' do
    patch rental_order_url(@rental_order), params: { group_id: @rental_order.group_id, num: @rental_order.num, rental_item_id: 0 }, as: :json
    assert_response :unprocessable_entity
  end

  test 'should destroy rental_order' do
    assert_difference('RentalOrder.count', -1) do
      delete rental_order_url(@rental_order), as: :json
    end

    assert_response :ok
  end
end
