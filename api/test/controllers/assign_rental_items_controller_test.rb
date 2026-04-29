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

  test 'should create assign_rental_item' do
    assert_difference('AssignRentalItem.count') do
      post assign_rental_items_url, params: {
        group_id: @assign_rental_item.group_id,
        rental_item_id: @assign_rental_item.rental_item_id,
        num: @assign_rental_item.num,
        stocker_place_id: @assign_rental_item.stocker_place_id,
        rental_place_id: @assign_rental_item.rental_place_id
      }, as: :json
    end

    assert_response :created
  end

  test 'should show assign_rental_item' do
    get assign_rental_item_url(@assign_rental_item), as: :json
    assert_response :success
  end

  test 'should update assign_rental_item' do
    patch assign_rental_item_url(@assign_rental_item), params: {
      assign_rental_item: {
        num: @assign_rental_item.num,
        rental_item_id: @assign_rental_item.rental_item_id,
        group_id: @assign_rental_item.group_id,
        stocker_place_id: @assign_rental_item.stocker_place_id,
        rental_place_id: @assign_rental_item.rental_place_id
      }
    }, as: :json
    assert_response :created
  end

  test 'should destroy assign_rental_item' do
    assert_difference('AssignRentalItem.count', -1) do
      delete assign_rental_item_url(@assign_rental_item), as: :json
    end

    assert_response :success
  end
end
