# frozen_string_literal: true

require 'test_helper'

class AssignRentalItemsControllerTest < ActionDispatch::IntegrationTest
  setup do
    @assign_rental_item = assign_rental_items(:one)
  end

  test 'should get index' do
    get assign_rental_items_url, as: :json
    assert_response :success
  end

  # createは物品ID・在庫場所IDを1つ受け取り、items配列の団体ごとに割当を作る形式
  test 'should create assign_rental_item' do
    assert_difference('AssignRentalItem.count') do
      post assign_rental_items_url,
           params: {
             rentalItemId: @assign_rental_item.rental_item_id,
             stockerPlaceId: @assign_rental_item.stocker_place_id,
             items: [{ group_id: @assign_rental_item.group_id, num: @assign_rental_item.num }]
           },
           as: :json
    end

    assert_response :success
  end

  test 'should show assign_rental_item' do
    get assign_rental_item_url(@assign_rental_item), as: :json
    assert_response :success
  end

  # updateはネストさせず、トップレベルのパラメータを受け取る
  test 'should update assign_rental_item' do
    patch assign_rental_item_url(@assign_rental_item),
          params: { num: @assign_rental_item.num, group_id: @assign_rental_item.group_id },
          as: :json
    assert_response :ok
  end

  test 'should destroy assign_rental_item' do
    assert_difference('AssignRentalItem.count', -1) do
      delete assign_rental_item_url(@assign_rental_item), as: :json
    end

    # destroyは204ではなく、削除結果をJSONで返す実装になっている
    assert_response :success
  end
end
