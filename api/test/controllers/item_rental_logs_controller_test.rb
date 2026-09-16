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

  # 単独の addition / reduction は対の片方だけを残してしまうため create では受け付けない。
  # 上限（提供元の未貸出数）も割当1件では決まらないので transfer 専用にしている。
  test 'create rejects an addition log and points at transfer' do
    assert_no_difference('ItemRentalLog.count') do
      post item_rental_logs_url, params: {
        uid: 'addition-uid',
        group_id: groups(:two).id,
        rental_item_id: @assign_rental_item.rental_item_id,
        stocker_place_id: @stocker_place.id,
        category: 'addition',
        quantity: 2
      }, headers: @headers, as: :json
    end

    assert_response :unprocessable_entity
    assert_match(/transfer/, response.parsed_body.dig('status', 'option').to_s)
  end

  test 'create rejects a reduction log even when it would exceed the assignment' do
    assert_no_difference('ItemRentalLog.count') do
      post item_rental_logs_url, params: {
        uid: 'reduction-uid',
        group_id: @group.id,
        rental_item_id: @assign_rental_item.rental_item_id,
        stocker_place_id: @stocker_place.id,
        category: 'reduction',
        quantity: 999
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

  test 'transfer should create the reduction/addition pair in one request' do
    assert_difference('ItemRentalLog.count', 2) do
      post transfer_item_rental_logs_url, params: transfer_params, headers: @headers, as: :json
    end

    assert_response :created
    body = response.parsed_body['data']
    assert_equal @group.id, body['reduction']['group_id']
    assert_equal groups(:two).id, body['addition']['group_id']
    assert_equal 'transfer-uid-reduction', body['reduction']['uid']
    assert_equal 'transfer-uid-addition', body['addition']['uid']
    assert_equal @recorder_email, body['reduction']['recorder_email']
  end

  # 片方だけ記録が残ると提供元の在庫が消えたままになるため、両方が成立しないなら何も残さない
  test 'transfer should not leave the reduction behind when the addition is invalid' do
    assert_no_difference('ItemRentalLog.count') do
      post transfer_item_rental_logs_url,
           params: transfer_params(uid: 'transfer-rollback-uid', to_group_id: 0),
           headers: @headers, as: :json
    end

    assert_response :unprocessable_entity
    assert_nil ItemRentalLog.find_by(uid: 'transfer-rollback-uid-reduction')
  end

  test 'transfer is idempotent when the same uid is resent' do
    post transfer_item_rental_logs_url, params: transfer_params(uid: 'transfer-resend-uid'),
                                        headers: @headers, as: :json
    assert_response :created
    created_ids = response.parsed_body['data'].values.pluck('id')

    assert_no_difference('ItemRentalLog.count') do
      post transfer_item_rental_logs_url, params: transfer_params(uid: 'transfer-resend-uid'),
                                          headers: @headers, as: :json
    end

    assert_response :success
    assert_equal created_ids, response.parsed_body['data'].values.pluck('id')
  end

  # 旧実装がreductionだけ残した状態からでも、足りない方を補って対にできる
  test 'transfer completes a pair that is only half recorded' do
    ItemRentalLog.create!(
      uid: 'transfer-half-uid-reduction',
      group: @group,
      rental_item_id: @assign_rental_item.rental_item_id,
      stocker_place_id: @stocker_place.id,
      category: :reduction,
      quantity: 2,
      recorder_email: @recorder_email
    )

    assert_difference('ItemRentalLog.count', 1) do
      post transfer_item_rental_logs_url, params: transfer_params(uid: 'transfer-half-uid'),
                                          headers: @headers, as: :json
    end

    assert_response :created
    assert_equal groups(:two).id, response.parsed_body['data']['addition']['group_id']
  end

  test 'transfer returns conflict when the same uid is reused with a different quantity' do
    post transfer_item_rental_logs_url, params: transfer_params(uid: 'transfer-conflict-uid'),
                                        headers: @headers, as: :json
    assert_response :created

    assert_no_difference('ItemRentalLog.count') do
      post transfer_item_rental_logs_url, params: transfer_params(uid: 'transfer-conflict-uid', quantity: 5),
                                          headers: @headers, as: :json
    end

    assert_response :conflict
  end

  test 'transfer rejects the same group on both sides' do
    assert_no_difference('ItemRentalLog.count') do
      post transfer_item_rental_logs_url, params: transfer_params(to_group_id: @group.id),
                                          headers: @headers, as: :json
    end

    assert_response :unprocessable_entity
  end

  test 'transfer rejects a non-positive quantity' do
    assert_no_difference('ItemRentalLog.count') do
      post transfer_item_rental_logs_url, params: transfer_params(quantity: 0), headers: @headers, as: :json
    end

    assert_response :unprocessable_entity
  end

  test 'transfer requires the recorder email' do
    assert_no_difference('ItemRentalLog.count') do
      post transfer_item_rental_logs_url, params: transfer_params,
                                          headers: { RentalBffAuthenticatable::API_TOKEN_HEADER => API_TOKEN },
                                          as: :json
    end

    assert_response :unauthorized
  end

  test 'transfer requires the rental BFF token' do
    assert_no_difference('ItemRentalLog.count') do
      post transfer_item_rental_logs_url, params: transfer_params, as: :json
    end

    assert_response :unauthorized
  end

  # 返した物はまた貸し出せる（同じ物が戻ってくるため、貸出残に戻す）
  test 'returning lent items makes them lendable again' do
    remaining = @assign_rental_item.lent_remaining

    post item_rental_logs_url, params: {
      uid: 'relend-rental-uid', assign_rental_item_id: @assign_rental_item.id,
      category: 'rental', quantity: remaining
    }, headers: @headers, as: :json
    assert_response :created
    assert_equal 0, @assign_rental_item.reload.lent_remaining

    # 全部返すと、貸出前と同じだけ貸し出せる状態に戻る
    post item_rental_logs_url, params: {
      uid: 'relend-return-uid', assign_rental_item_id: @assign_rental_item.id,
      category: 'return', quantity: remaining
    }, headers: @headers, as: :json
    assert_response :created
    assert_equal remaining, @assign_rental_item.reload.lent_remaining

    assert_difference('ItemRentalLog.count') do
      post item_rental_logs_url, params: {
        uid: 'relend-again-uid', assign_rental_item_id: @assign_rental_item.id,
        category: 'rental', quantity: remaining
      }, headers: @headers, as: :json
    end
    assert_response :created
  end

  # 返却の上限は「いま貸している数」のままで、返しすぎは通らない
  test 'returning more than what is currently lent out is still rejected' do
    assert_no_difference('ItemRentalLog.count') do
      post item_rental_logs_url, params: {
        uid: 'over-return-after-relend-uid', assign_rental_item_id: @assign_rental_item.id,
        category: 'return', quantity: @assign_rental_item.return_remaining + 1
      }, headers: @headers, as: :json
    end

    assert_response :unprocessable_entity
  end

  # --- 上限チェック（BFF用トークンでAPIを直接叩かれても超過できないこと）---

  test 'should reject a rental beyond the lent remaining' do
    remaining = @assign_rental_item.lent_remaining

    assert_no_difference('ItemRentalLog.count') do
      post item_rental_logs_url, params: {
        uid: 'over-lent-remaining-uid',
        assign_rental_item_id: @assign_rental_item.id,
        category: 'rental',
        quantity: remaining + 1
      }, headers: @headers, as: :json
    end

    assert_response :unprocessable_entity
    assert_includes response.parsed_body.dig('status', 'option').to_s, remaining.to_s
  end

  test 'should allow a rental exactly at the lent remaining' do
    assert_difference('ItemRentalLog.count') do
      post item_rental_logs_url, params: {
        uid: 'exact-lent-remaining-uid',
        assign_rental_item_id: @assign_rental_item.id,
        category: 'rental',
        quantity: @assign_rental_item.lent_remaining
      }, headers: @headers, as: :json
    end

    assert_response :created
  end

  test 'should reject a return beyond the quantity already lent out' do
    assert_no_difference('ItemRentalLog.count') do
      post item_rental_logs_url, params: {
        uid: 'over-return-remaining-uid',
        assign_rental_item_id: @assign_rental_item.id,
        category: 'return',
        quantity: @assign_rental_item.return_remaining + 1
      }, headers: @headers, as: :json
    end

    assert_response :unprocessable_entity
  end

  test 'should reject a rental_absolute beyond the effective assigned quantity' do
    limit = @assign_rental_item.effective_num + @assign_rental_item.returned_quantity

    assert_no_difference('ItemRentalLog.count') do
      post item_rental_logs_url, params: {
        uid: 'over-effective-num-uid',
        assign_rental_item_id: @assign_rental_item.id,
        category: 'rental_absolute',
        quantity: limit + 1
      }, headers: @headers, as: :json
    end

    assert_response :unprocessable_entity
  end

  test 'should reject a return_absolute beyond the quantity already lent out' do
    assert_no_difference('ItemRentalLog.count') do
      post item_rental_logs_url, params: {
        uid: 'over-lent-quantity-uid',
        assign_rental_item_id: @assign_rental_item.id,
        category: 'return_absolute',
        quantity: @assign_rental_item.lent_quantity + 1
      }, headers: @headers, as: :json
    end

    assert_response :unprocessable_entity
  end

  # 実効割当数は addition / reduction を織り込む（設計書5章）
  test 'an addition log raises the limit of the rental it allows' do
    over_limit = @assign_rental_item.lent_remaining + 3
    ItemRentalLog.create!(
      uid: 'limit-raising-addition-uid',
      group: @group,
      rental_item_id: @assign_rental_item.rental_item_id,
      stocker_place_id: @assign_rental_item.stocker_place_id,
      category: :addition,
      quantity: 3,
      recorder_email: @recorder_email
    )

    assert_difference('ItemRentalLog.count') do
      post item_rental_logs_url, params: {
        uid: 'rental-after-addition-uid',
        assign_rental_item_id: @assign_rental_item.id,
        category: 'rental',
        quantity: over_limit
      }, headers: @headers, as: :json
    end

    assert_response :created
  end

  test 'transfer rejects a quantity beyond the source unlent quantity' do
    over_limit = @assign_rental_item.lent_remaining + 1

    assert_no_difference('ItemRentalLog.count') do
      post transfer_item_rental_logs_url,
           params: transfer_params(uid: 'transfer-over-limit-uid', quantity: over_limit),
           headers: @headers, as: :json
    end

    assert_response :unprocessable_entity
  end

  # 1回目で提供元が減るため、再送では上限を確かめ直さない（確かめると必ず超過になる）
  test 'transfer resend is not blocked by the limit it consumed itself' do
    params = transfer_params(uid: 'transfer-limit-resend-uid', quantity: @assign_rental_item.lent_remaining)

    post transfer_item_rental_logs_url, params: params, headers: @headers, as: :json
    assert_response :created

    assert_no_difference('ItemRentalLog.count') do
      post transfer_item_rental_logs_url, params: params, headers: @headers, as: :json
    end

    assert_response :success
  end

  # もともとその物品を申請していない団体にも渡せること。
  # 渡す先に割当が無いと addition を足す先も、渡した分を記録する先も無いため、
  # transfer が num 0 の割当を用意する。
  test 'transfer creates the destination assignment when the group has none' do
    destination = groups(:two)
    attributes = {
      group_id: destination.id,
      rental_item_id: @assign_rental_item.rental_item_id,
      stocker_place_id: @assign_rental_item.stocker_place_id
    }
    assert_nil AssignRentalItem.find_by(attributes)

    assert_difference('AssignRentalItem.count') do
      post transfer_item_rental_logs_url,
           params: transfer_params(uid: 'transfer-new-assignment-uid', quantity: 2,
                                   rental_place_id: @assign_rental_item.rental_place_id),
           headers: @headers, as: :json
    end
    assert_response :created

    created = AssignRentalItem.find_by(attributes)
    assert_equal 0, created.num
    assert_equal @assign_rental_item.rental_place_id, created.rental_place_id
    # 実効割当数は addition のぶんだけ増え、その数まで貸し出せる
    assert_equal 2, created.effective_num
    assert_equal 2, created.lent_remaining
  end

  # 既にある割当には手を入れない（貸出場所を上書きしない）
  test 'transfer keeps an existing destination assignment as it is' do
    destination = AssignRentalItem.create!(
      group_id: groups(:two).id,
      rental_item_id: @assign_rental_item.rental_item_id,
      stocker_place_id: @assign_rental_item.stocker_place_id,
      rental_place_id: @assign_rental_item.rental_place_id,
      num: 3
    )

    assert_no_difference('AssignRentalItem.count') do
      post transfer_item_rental_logs_url,
           params: transfer_params(uid: 'transfer-existing-assignment-uid', quantity: 2,
                                   rental_place_id: stocker_places(:two).id),
           headers: @headers, as: :json
    end
    assert_response :created

    destination.reload
    assert_equal 3, destination.num
    assert_equal @assign_rental_item.rental_place_id, destination.rental_place_id
    assert_equal 5, destination.effective_num
  end

  private

  def transfer_params(overrides = {})
    {
      uid: 'transfer-uid',
      rental_item_id: @assign_rental_item.rental_item_id,
      stocker_place_id: @stocker_place.id,
      from_group_id: @group.id,
      to_group_id: groups(:two).id,
      quantity: 2
    }.merge(overrides)
  end

  # BFFからの呼び出しを模したヘッダー。トークンで呼び出し元を、
  # Cf-Access-Authenticated-User-Email で記録者を表す。
  def bff_headers(recorder_email)
    {
      RentalBffAuthenticatable::API_TOKEN_HEADER => API_TOKEN,
      RentalBffAuthenticatable::RECORDER_EMAIL_HEADER => recorder_email,
      # 超過貸出はSlackへ流すため、テストでは止める
      'X-Skip-Slack-Notification' => 'true'
    }
  end
end
