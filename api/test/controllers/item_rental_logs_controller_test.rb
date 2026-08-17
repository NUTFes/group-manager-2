# frozen_string_literal: true

require 'test_helper'

class ItemRentalLogsControllerTest < ActionDispatch::IntegrationTest
  setup do
    @item_rental_log = item_rental_logs(:one)
    @stocker_place = stocker_places(:one)
    @rental_item = rental_items(:one)
    @group = groups(:one)
    @headers = { 'Cf-Access-Authenticated-User-Email' => 'recorder@example.com' }
  end

  test 'should get index filtered by rental_place_id and group_id, including planned quantity' do
    AssignRentalItem.create!(
      group_id: @group.id,
      rental_item_id: @item_rental_log.rental_item_id,
      stocker_place_id: @stocker_place.id,
      rental_place_id: @stocker_place.id,
      num: 5
    )

    get item_rental_logs_url, params: { rental_place_id: @stocker_place.id, group_id: @group.id }
    assert_response :success

    body = response.parsed_body
    log_ids = body['data']['item_rental_logs'].pluck('id')
    assert_includes log_ids, @item_rental_log.id

    planned_nums = body['data']['assign_rental_items'].pluck('num')
    assert_includes planned_nums, 5
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
        stocker_place_id: @stocker_place.id,
        rental_item_id: @rental_item.id,
        category: 'rental',
        quantity: 3
      }, headers: @headers, as: :json
    end

    assert_response :created
    body = response.parsed_body
    assert_equal 'recorder@example.com', body['data']['recorder_email']
  end

  test 'should return existing record when uid already exists' do
    assert_no_difference('ItemRentalLog.count') do
      post item_rental_logs_url, params: {
        uid: @item_rental_log.uid,
        stocker_place_id: @stocker_place.id,
        rental_item_id: @rental_item.id,
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
        stocker_place_id: @stocker_place.id,
        rental_item_id: @rental_item.id,
        category: 'not_a_real_category',
        quantity: 1
      }, headers: @headers, as: :json
    end

    assert_response :unprocessable_entity
  end
end
