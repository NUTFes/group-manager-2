# frozen_string_literal: true

require 'test_helper'

class ItemRentalLogsControllerTest < ActionDispatch::IntegrationTest
  setup do
    @item_rental_log = item_rental_logs(:one)
    @assign_rental_item = assign_rental_items(:one)
    @stocker_place = stocker_places(:one)
    @group = groups(:one)
    @headers = { 'Cf-Access-Authenticated-User-Email' => 'recorder@example.com' }
  end

  test 'should get index filtered by rental_place_id and group_id, including planned quantity' do
    get item_rental_logs_url, params: { rental_place_id: @assign_rental_item.rental_place_id, group_id: @assign_rental_item.group_id }
    assert_response :success

    body = response.parsed_body
    log_ids = body['data']['item_rental_logs'].pluck('id')
    assert_includes log_ids, @item_rental_log.id

    planned_nums = body['data']['assign_rental_items'].pluck('num')
    assert_includes planned_nums, @assign_rental_item.num
  end

  test 'should not mix logs from a different assignment of the same rental_item' do
    other_assignment = AssignRentalItem.create!(
      group_id: groups(:two).id,
      rental_item_id: @assign_rental_item.rental_item_id,
      stocker_place_id: @stocker_place.id,
      rental_place_id: @stocker_place.id,
      num: 9
    )
    other_log = ItemRentalLog.create!(
      uid: 'other-assignment-log-uid',
      assign_rental_item: other_assignment,
      stocker_place_id: other_assignment.stocker_place_id,
      rental_item_id: other_assignment.rental_item_id,
      category: :rental,
      quantity: 1,
      recorder_email: 'other@example.com'
    )

    get item_rental_logs_url, params: { rental_place_id: @assign_rental_item.rental_place_id, group_id: @assign_rental_item.group_id }
    assert_response :success

    log_ids = response.parsed_body['data']['item_rental_logs'].pluck('id')
    assert_includes log_ids, @item_rental_log.id
    assert_not_includes log_ids, other_log.id
  end

  test 'should get index without filters when rental_place_id is absent' do
    get item_rental_logs_url
    assert_response :success

    body = response.parsed_body
    log_ids = body['data']['item_rental_logs'].pluck('id')
    assert_includes log_ids, item_rental_logs(:one).id
    assert_includes log_ids, item_rental_logs(:two).id
  end

  test 'should create item_rental_log and take recorder_email from header' do
    assert_difference('ItemRentalLog.count') do
      post item_rental_logs_url, params: {
        uid: 'new-item-rental-log-uid',
        assign_rental_item_id: @assign_rental_item.id,
        category: 'rental',
        quantity: 3
      }, headers: @headers, as: :json
    end

    assert_response :created
    body = response.parsed_body
    assert_equal 'recorder@example.com', body['data']['recorder_email']
    assert_equal @assign_rental_item.rental_item_id, body['data']['rental_item_id']
  end

  test 'should return existing record when uid already exists' do
    assert_no_difference('ItemRentalLog.count') do
      post item_rental_logs_url, params: {
        uid: @item_rental_log.uid,
        assign_rental_item_id: @assign_rental_item.id,
        category: 'rental',
        quantity: 99
      }, headers: @headers, as: :json
    end

    assert_response :success
    body = response.parsed_body
    assert_equal @item_rental_log.id, body['data']['id']
  end

  test 'should reject invalid category' do
    assert_no_difference('ItemRentalLog.count') do
      post item_rental_logs_url, params: {
        uid: 'invalid-category-uid',
        assign_rental_item_id: @assign_rental_item.id,
        category: 'not_a_real_category',
        quantity: 1
      }, headers: @headers, as: :json
    end

    assert_response :unprocessable_entity
  end

  test 'should reject unknown assign_rental_item_id' do
    assert_no_difference('ItemRentalLog.count') do
      post item_rental_logs_url, params: {
        uid: 'unknown-assignment-uid',
        assign_rental_item_id: 0,
        category: 'rental',
        quantity: 1
      }, headers: @headers, as: :json
    end

    assert_response :not_found
  end

  test 'should reject negative quantity' do
    assert_no_difference('ItemRentalLog.count') do
      post item_rental_logs_url, params: {
        uid: 'negative-quantity-uid',
        assign_rental_item_id: @assign_rental_item.id,
        category: 'rental',
        quantity: -1
      }, headers: @headers, as: :json
    end

    assert_response :unprocessable_entity
  end

  test 'should reject a request without recorder email header' do
    assert_no_difference('ItemRentalLog.count') do
      post item_rental_logs_url, params: {
        uid: 'missing-recorder-email-uid',
        assign_rental_item_id: @assign_rental_item.id,
        category: 'rental',
        quantity: 1
      }, as: :json
    end

    assert_response :unprocessable_entity
  end
end
