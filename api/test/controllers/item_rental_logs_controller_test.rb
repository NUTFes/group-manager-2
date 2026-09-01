# frozen_string_literal: true

require 'test_helper'

class ItemRentalLogsControllerTest < ActionDispatch::IntegrationTest
  setup do
    @item_rental_log = item_rental_logs(:one)
    @assign_rental_item = assign_rental_items(:one)
    @stocker_place = stocker_places(:one)
    @group = groups(:one)

    Role.find_or_create_by!(id: 1) { |role| role.name = 'admin' }
    Role.find_or_create_by!(id: 2) { |role| role.name = 'staff' }
    Role.find_or_create_by!(id: 3) { |role| role.name = 'user' }
    @admin = create_user!(email: 'admin-item-rental-log@example.com', role_id: 1)
    @staff = create_user!(email: 'staff-item-rental-log@example.com', role_id: 2)
    @restricted_user = create_user!(email: 'restricted-item-rental-log@example.com', role_id: 3)
    @headers = auth_headers(@admin)
  end

  test 'should get index filtered by rental_place_id and group_id, including planned quantity' do
    get item_rental_logs_url,
        params: { rental_place_id: @assign_rental_item.rental_place_id, group_id: @assign_rental_item.group_id },
        headers: @headers
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

    get item_rental_logs_url,
        params: { rental_place_id: @assign_rental_item.rental_place_id, group_id: @assign_rental_item.group_id },
        headers: @headers
    assert_response :success

    log_ids = response.parsed_body['data']['item_rental_logs'].pluck('id')
    assert_includes log_ids, @item_rental_log.id
    assert_not_includes log_ids, other_log.id
  end

  test 'should get index without filters when rental_place_id is absent' do
    get item_rental_logs_url, headers: @headers
    assert_response :success

    body = response.parsed_body
    log_ids = body['data']['item_rental_logs'].pluck('id')
    assert_includes log_ids, item_rental_logs(:one).id
    assert_includes log_ids, item_rental_logs(:two).id
  end

  test 'index requires authentication' do
    get item_rental_logs_url
    assert_response :unauthorized
  end

  test 'restricted user cannot get index' do
    get item_rental_logs_url, headers: auth_headers(@restricted_user)
    assert_response :forbidden
  end

  test 'should create item_rental_log and take recorder_email from the authenticated staff user' do
    assert_difference('ItemRentalLog.count') do
      post item_rental_logs_url, params: {
        uid: 'new-item-rental-log-uid',
        assign_rental_item_id: @assign_rental_item.id,
        category: 'rental',
        quantity: 3
      }, headers: auth_headers(@staff), as: :json
    end

    assert_response :created
    body = response.parsed_body
    assert_equal @staff.email, body['data']['recorder_email']
    assert_equal @assign_rental_item.rental_item_id, body['data']['rental_item_id']
  end

  test 'a spoofed Cf-Access header does not override the recorder_email' do
    assert_difference('ItemRentalLog.count') do
      post item_rental_logs_url, params: {
        uid: 'spoofed-header-uid',
        assign_rental_item_id: @assign_rental_item.id,
        category: 'rental',
        quantity: 1
      }, headers: @headers.merge('Cf-Access-Authenticated-User-Email' => 'attacker@example.com'), as: :json
    end

    assert_response :created
    assert_equal @admin.email, response.parsed_body['data']['recorder_email']
  end

  test 'create requires authentication' do
    assert_no_difference('ItemRentalLog.count') do
      post item_rental_logs_url, params: {
        uid: 'unauthenticated-uid',
        assign_rental_item_id: @assign_rental_item.id,
        category: 'rental',
        quantity: 1
      }, as: :json
    end

    assert_response :unauthorized
  end

  test 'restricted user cannot create item_rental_log' do
    assert_no_difference('ItemRentalLog.count') do
      post item_rental_logs_url, params: {
        uid: 'restricted-user-uid',
        assign_rental_item_id: @assign_rental_item.id,
        category: 'rental',
        quantity: 1
      }, headers: auth_headers(@restricted_user), as: :json
    end

    assert_response :forbidden
  end

  test 'should return existing record when uid is resent with the same event data by the same user' do
    post item_rental_logs_url, params: {
      uid: 'resend-same-user-uid',
      assign_rental_item_id: @assign_rental_item.id,
      category: 'rental',
      quantity: 2
    }, headers: @headers, as: :json
    assert_response :created
    original_id = response.parsed_body['data']['id']

    assert_no_difference('ItemRentalLog.count') do
      post item_rental_logs_url, params: {
        uid: 'resend-same-user-uid',
        assign_rental_item_id: @assign_rental_item.id,
        category: 'rental',
        quantity: 2
      }, headers: @headers, as: :json
    end

    assert_response :success
    assert_equal original_id, response.parsed_body['data']['id']
  end

  test 'should return conflict when uid is reused with different event data' do
    assert_no_difference('ItemRentalLog.count') do
      post item_rental_logs_url, params: {
        uid: @item_rental_log.uid,
        assign_rental_item_id: @item_rental_log.assign_rental_item_id,
        category: @item_rental_log.category,
        quantity: @item_rental_log.quantity + 1
      }, headers: @headers, as: :json
    end

    assert_response :conflict
  end

  test 'should return conflict when uid is reused by a different recorder' do
    post item_rental_logs_url, params: {
      uid: 'resend-different-user-uid',
      assign_rental_item_id: @assign_rental_item.id,
      category: 'rental',
      quantity: 2
    }, headers: @headers, as: :json
    assert_response :created

    assert_no_difference('ItemRentalLog.count') do
      post item_rental_logs_url, params: {
        uid: 'resend-different-user-uid',
        assign_rental_item_id: @assign_rental_item.id,
        category: 'rental',
        quantity: 2
      }, headers: auth_headers(@staff), as: :json
    end

    assert_response :conflict
  end

  test 'should reject creating a log when the assignment has no stocker_place' do
    placeless_assignment = AssignRentalItem.create!(
      group: @group,
      rental_item: @assign_rental_item.rental_item,
      stocker_place: nil,
      rental_place: nil,
      num: 1
    )

    assert_no_difference('ItemRentalLog.count') do
      post item_rental_logs_url, params: {
        uid: 'placeless-assignment-uid',
        assign_rental_item_id: placeless_assignment.id,
        category: 'rental',
        quantity: 1
      }, headers: @headers, as: :json
    end

    assert_response :unprocessable_entity
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

  private

  def create_user!(email:, role_id:)
    User.create!(
      name: email.split('@').first,
      email: email,
      uid: email,
      provider: 'email',
      password: 'password',
      password_confirmation: 'password',
      role_id: role_id
    )
  end

  def auth_headers(user)
    user.create_new_auth_token
  end
end
