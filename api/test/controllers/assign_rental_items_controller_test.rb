# frozen_string_literal: true

require 'test_helper'

class AssignRentalItemsControllerTest < ActionDispatch::IntegrationTest
  # スキーマと乖離した他機能の fixture に影響されず、この機能に必要なデータだけを読み込む。
  self.fixture_table_names = %w[groups rental_items stocker_places assign_rental_items]

  setup do
    @assign_rental_item = assign_rental_items(:one)
  end

  test 'should get index' do
    get assign_rental_items_url, as: :json
    assert_response :success

    response_data = response.parsed_body.fetch('data')
    assert_equal '長岡高専A', response_data.find { |item| item['id'] == @assign_rental_item.id }.fetch('remark')
  end

  test 'should create assign_rental_item with remark' do
    assert_difference('AssignRentalItem.count') do
      post assign_rental_items_url,
           params: {
             rentalItemId: rental_items(:one).id,
             stockerPlaceId: stocker_places(:one).id,
             items: [
               {
                 group_id: groups(:one).id,
                 num: 2,
                 remark: '1、2、長岡高専A'
               }
             ]
           },
           as: :json
    end

    assert_response :success
    created_item = AssignRentalItem.order(:id).last
    assert_equal '1、2、長岡高専A', created_item.remark
    assert_equal '1、2、長岡高専A', response.parsed_body.dig('data', 0, 'remark')
  end

  test 'should not create assign_rental_item with invalid group' do
    assert_no_difference('AssignRentalItem.count') do
      post assign_rental_items_url,
           params: {
             rentalItemId: rental_items(:one).id,
             stockerPlaceId: stocker_places(:one).id,
             items: [{ group_id: -1, num: 1, remark: '保存されない備考' }]
           },
           as: :json
    end

    assert_equal 500, response.parsed_body.dig('status', 'code')
  end

  test 'should show assign_rental_item' do
    get assign_rental_item_url(@assign_rental_item), as: :json
    assert_response :success
    assert_equal '長岡高専A', response.parsed_body.dig('data', 'remark')
  end

  test 'should update remark' do
    patch assign_rental_item_url(@assign_rental_item),
          params: { remark: 'テント1、テント2' },
          as: :json

    assert_response :ok
    assert_equal 'テント1、テント2', @assign_rental_item.reload.remark
    assert_equal 'テント1、テント2', response.parsed_body.dig('data', 'remark')
  end

  test 'should allow blank remark' do
    patch assign_rental_item_url(@assign_rental_item), params: { remark: nil }, as: :json

    assert_response :ok
    assert_nil @assign_rental_item.reload.remark
  end

  test 'should destroy assign_rental_item' do
    assert_difference('AssignRentalItem.count', -1) do
      delete assign_rental_item_url(@assign_rental_item), as: :json
    end

    assert_response :ok
  end
end
