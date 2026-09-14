# frozen_string_literal: true

require 'test_helper'

class ItemRentalLogsControllerTest < ActionDispatch::IntegrationTest
  API_TOKEN = 'test-rental-api-token'

  setup do
    @item_rental_log = item_rental_logs(:one)
    @assign_rental_item = assign_rental_items(:one)
    @stocker_place = stocker_places(:one)
    @group = groups(:one)

    ENV['RENTAL_API_TOKEN'] = API_TOKEN
    @recorder_email = 'recorder-one@example.com'
    @other_recorder_email = 'recorder-two@example.com'
    @headers = bff_headers(@recorder_email)
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
      group_id: other_assignment.group_id,
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

  test 'index requires the rental BFF token' do
    get item_rental_logs_url
    assert_response :unauthorized
  end

  test 'index rejects an invalid rental BFF token' do
    get item_rental_logs_url, headers: { RentalBffAuthenticatable::API_TOKEN_HEADER => 'wrong-token' }
    assert_response :unauthorized
  end

  test 'index does not require the recorder email' do
    get item_rental_logs_url,
        headers: { RentalBffAuthenticatable::API_TOKEN_HEADER => API_TOKEN }
    assert_response :success
  end

  test 'index is rejected when RENTAL_API_TOKEN is not configured' do
    ENV['RENTAL_API_TOKEN'] = ''
    get item_rental_logs_url, headers: @headers
    assert_response :unauthorized
  ensure
    ENV['RENTAL_API_TOKEN'] = API_TOKEN
  end

  test 'should create item_rental_log and take recorder_email from the Cf-Access header' do
    assert_difference('ItemRentalLog.count') do
      post item_rental_logs_url, params: {
        uid: 'new-item-rental-log-uid',
        assign_rental_item_id: @assign_rental_item.id,
        category: 'rental',
        quantity: 3
      }, headers: bff_headers(@other_recorder_email), as: :json
    end

    assert_response :created
    body = response.parsed_body
    assert_equal @other_recorder_email, body['data']['recorder_email']
    assert_equal @assign_rental_item.rental_item_id, body['data']['rental_item_id']
  end

  test 'a recorder_email parameter does not override the Cf-Access header' do
    assert_difference('ItemRentalLog.count') do
      post item_rental_logs_url, params: {
        uid: 'spoofed-param-uid',
        assign_rental_item_id: @assign_rental_item.id,
        category: 'rental',
        quantity: 1,
        recorder_email: 'attacker@example.com'
      }, headers: @headers, as: :json
    end

    assert_response :created
    assert_equal @recorder_email, response.parsed_body['data']['recorder_email']
  end

  test 'should save memo when it is sent' do
    assert_difference('ItemRentalLog.count') do
      post item_rental_logs_url, params: {
        uid: 'memo-uid',
        assign_rental_item_id: @assign_rental_item.id,
        category: 'rental',
        quantity: 1,
        memo: '長机の脚が1本ゆるい'
      }, headers: @headers, as: :json
    end

    assert_response :created
    assert_equal '長机の脚が1本ゆるい', response.parsed_body['data']['memo']
  end

  test 'memo is optional' do
    assert_difference('ItemRentalLog.count') do
      post item_rental_logs_url, params: {
        uid: 'without-memo-uid',
        assign_rental_item_id: @assign_rental_item.id,
        category: 'rental',
        quantity: 1
      }, headers: @headers, as: :json
    end

    assert_response :created
    assert_nil response.parsed_body['data']['memo']
  end

  test 'resending the same uid with a different memo returns the existing record instead of a conflict' do
    post item_rental_logs_url, params: {
      uid: 'memo-resend-uid',
      assign_rental_item_id: @assign_rental_item.id,
      category: 'rental',
      quantity: 2,
      memo: '最初のメモ'
    }, headers: @headers, as: :json
    assert_response :created
    created_id = response.parsed_body['data']['id']

    # memoは冪等性の判定に含めないため、メモだけ違う再送は409にせず既存を返す
    assert_no_difference('ItemRentalLog.count') do
      post item_rental_logs_url, params: {
        uid: 'memo-resend-uid',
        assign_rental_item_id: @assign_rental_item.id,
        category: 'rental',
        quantity: 2,
        memo: '違うメモ'
      }, headers: @headers, as: :json
    end

    assert_response :success
    body = response.parsed_body
    assert_equal created_id, body['data']['id']
    assert_equal '最初のメモ', body['data']['memo']
  end

  test 'create requires the rental BFF token' do
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

  test 'create is rejected when the recorder email is missing' do
    assert_no_difference('ItemRentalLog.count') do
      post item_rental_logs_url, params: {
        uid: 'missing-recorder-uid',
        assign_rental_item_id: @assign_rental_item.id,
        category: 'rental',
        quantity: 1
      }, headers: { RentalBffAuthenticatable::API_TOKEN_HEADER => API_TOKEN }, as: :json
    end

    assert_response :unauthorized
  end

  test 'create is rejected with an invalid rental BFF token' do
    assert_no_difference('ItemRentalLog.count') do
      post item_rental_logs_url, params: {
        uid: 'invalid-token-uid',
        assign_rental_item_id: @assign_rental_item.id,
        category: 'rental',
        quantity: 1
      }, headers: bff_headers(@recorder_email).merge(
        RentalBffAuthenticatable::API_TOKEN_HEADER => 'wrong-token'
      ), as: :json
    end

    assert_response :unauthorized
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
      }, headers: bff_headers(@other_recorder_email), as: :json
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

  test 'should create an addition log without assign_rental_item_id' do
    assert_difference('ItemRentalLog.count') do
      post item_rental_logs_url, params: {
        uid: 'addition-uid',
        group_id: groups(:two).id,
        rental_item_id: @assign_rental_item.rental_item_id,
        stocker_place_id: @stocker_place.id,
        category: 'addition',
        quantity: 2
      }, headers: @headers, as: :json
    end

    assert_response :created
    body = response.parsed_body['data']
    assert_nil body['assign_rental_item_id']
    assert_equal groups(:two).id, body['group_id']
  end

  test 'should create a reduction log without assign_rental_item_id' do
    assert_difference('ItemRentalLog.count') do
      post item_rental_logs_url, params: {
        uid: 'reduction-uid',
        group_id: @group.id,
        rental_item_id: @assign_rental_item.rental_item_id,
        stocker_place_id: @stocker_place.id,
        category: 'reduction',
        quantity: 2
      }, headers: @headers, as: :json
    end

    assert_response :created
    assert_nil response.parsed_body['data']['assign_rental_item_id']
  end

  test 'should reject an addition log that includes assign_rental_item_id' do
    assert_no_difference('ItemRentalLog.count') do
      post item_rental_logs_url, params: {
        uid: 'addition-with-assignment-uid',
        assign_rental_item_id: @assign_rental_item.id,
        group_id: @group.id,
        rental_item_id: @assign_rental_item.rental_item_id,
        stocker_place_id: @stocker_place.id,
        category: 'addition',
        quantity: 2
      }, headers: @headers, as: :json
    end

    assert_response :unprocessable_entity
  end

  test 'should reject an addition log without group_id' do
    assert_no_difference('ItemRentalLog.count') do
      post item_rental_logs_url, params: {
        uid: 'addition-without-group-uid',
        rental_item_id: @assign_rental_item.rental_item_id,
        stocker_place_id: @stocker_place.id,
        category: 'addition',
        quantity: 2
      }, headers: @headers, as: :json
    end

    assert_response :unprocessable_entity
  end

  test 'should get index filtered by group_id including addition/reduction logs' do
    assignment_change_log = ItemRentalLog.create!(
      uid: 'index-addition-uid',
      group: @group,
      rental_item_id: @assign_rental_item.rental_item_id,
      stocker_place_id: @stocker_place.id,
      category: :addition,
      quantity: 3,
      recorder_email: 'recorder@example.com'
    )

    get item_rental_logs_url, params: { group_id: @group.id }, headers: @headers
    assert_response :success

    log_ids = response.parsed_body['data']['item_rental_logs'].pluck('id')
    assert_includes log_ids, assignment_change_log.id
  end

  test 'should exclude addition/reduction logs of the same group when rental_place_id is also given' do
    assignment_change_log = ItemRentalLog.create!(
      uid: 'index-addition-with-rental-place-uid',
      group: @group,
      rental_item_id: @assign_rental_item.rental_item_id,
      stocker_place_id: @stocker_place.id,
      category: :addition,
      quantity: 3,
      recorder_email: 'recorder@example.com'
    )

    get item_rental_logs_url,
        params: { rental_place_id: @assign_rental_item.rental_place_id, group_id: @group.id },
        headers: @headers
    assert_response :success

    log_ids = response.parsed_body['data']['item_rental_logs'].pluck('id')
    assert_not_includes log_ids, assignment_change_log.id
  end

  test 'should create a rental_absolute log' do
    assert_difference('ItemRentalLog.count') do
      post item_rental_logs_url, params: {
        uid: 'rental-absolute-uid',
        assign_rental_item_id: @assign_rental_item.id,
        category: 'rental_absolute',
        quantity: 5
      }, headers: @headers, as: :json
    end

    assert_response :created
  end

  test 'should create a return_absolute log' do
    assert_difference('ItemRentalLog.count') do
      post item_rental_logs_url, params: {
        uid: 'return-absolute-uid',
        assign_rental_item_id: @assign_rental_item.id,
        category: 'return_absolute',
        quantity: 5
      }, headers: @headers, as: :json
    end

    assert_response :created
  end

  private

  # BFFからの呼び出しを模したヘッダー。トークンで呼び出し元を、
  # Cf-Access-Authenticated-User-Email で記録者を表す。
  def bff_headers(recorder_email)
    {
      RentalBffAuthenticatable::API_TOKEN_HEADER => API_TOKEN,
      RentalBffAuthenticatable::RECORDER_EMAIL_HEADER => recorder_email
    }
  end
end
