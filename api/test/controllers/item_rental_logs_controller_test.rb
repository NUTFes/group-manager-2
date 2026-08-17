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

  test 'should get index filtered by rental_place_id and group_id' do
    AssignRentalItem.create!(
      group_id: @group.id,
      rental_item_id: @item_rental_log.rental_item_id,
      stocker_place_id: @stocker_place.id,
      rental_place_id: @stocker_place.id,
      num: 1
    )

    get item_rental_logs_url, params: { rental_place_id: @stocker_place.id, group_id: @group.id }
    assert_response :success

    body = response.parsed_body
    ids = body['data'].pluck('id')
    assert_includes ids, @item_rental_log.id
  end

  test 'should require rental_place_id on index' do
    get item_rental_logs_url
    assert_response :unprocessable_entity
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
