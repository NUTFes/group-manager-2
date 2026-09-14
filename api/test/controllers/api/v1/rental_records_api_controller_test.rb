# frozen_string_literal: true

require 'test_helper'

class Api::V1::RentalRecordsApiControllerTest < ActionDispatch::IntegrationTest
  API_TOKEN = 'test-rental-api-token'

  setup do
    ENV['RENTAL_API_TOKEN'] = API_TOKEN
    @headers = { RentalBffAuthenticatable::API_TOKEN_HEADER => API_TOKEN }

    # fixture のログが混ざると件数の検証がぶれるため、このテストで作るものだけにする
    ItemRentalLog.delete_all

    @assign_rental_item = assign_rental_items(:one)
    @group = @assign_rental_item.group
    @other_assign_rental_item = assign_rental_items(:two)

    # 今年度の判定は UserPageSetting.first.fes_year_id を見るため、
    # fixture の団体と同じ年度を指しておく
    FesYear.find_or_create_by!(id: @group.fes_year_id) { |fes_year| fes_year.year_num = 2026 }
    UserPageSetting.first.update!(fes_year_id: @group.fes_year_id)

    @log = ItemRentalLog.create!(
      uid: 'rental-view-log-uid',
      assign_rental_item: @assign_rental_item,
      group: @group,
      rental_item: @assign_rental_item.rental_item,
      stocker_place: @assign_rental_item.stocker_place,
      category: :rental,
      quantity: 2,
      memo: '1脚だけ脚がゆるい',
      recorder_email: 'recorder@example.com'
    )
  end

  test 'rental places require the rental BFF token' do
    get api_v1_get_rental_places_for_rental_view_url
    assert_response :unauthorized
  end

  test 'should get rental places used by this year assignments' do
    get api_v1_get_rental_places_for_rental_view_url, headers: @headers

    assert_response :success
    ids = response.parsed_body['data'].pluck('id')
    assert_includes ids, @assign_rental_item.rental_place_id
    assert_equal ids.uniq, ids
  end

  test 'should get groups that have assignments at the rental place' do
    get api_v1_get_groups_for_rental_view_url,
        params: { rental_place_id: @assign_rental_item.rental_place_id }, headers: @headers

    assert_response :success
    ids = response.parsed_body['data'].pluck('id')
    assert_includes ids, @group.id
    assert_not_includes ids, @other_assign_rental_item.group_id
  end

  test 'should exclude groups from other fes years' do
    # 団体側のfes_yearを書き換えるとbelongs_to(user/group_category)の検証に
    # 引っかかるため、現在年度の設定を別年度に向けて「今年度以外」を再現する
    other_year = FesYear.create!(year_num: 1999)
    UserPageSetting.first.update!(fes_year_id: other_year.id)

    get api_v1_get_groups_for_rental_view_url,
        params: { rental_place_id: @assign_rental_item.rental_place_id }, headers: @headers

    assert_response :success
    ids = response.parsed_body['data'].pluck('id')
    assert_not_includes ids, @group.id
  end

  test 'should exclude assignments from other fes years' do
    other_year = FesYear.create!(year_num: 1999)
    UserPageSetting.first.update!(fes_year_id: other_year.id)

    get api_v1_get_assign_rental_items_for_rental_view_url,
        params: { group_id: @group.id }, headers: @headers

    assert_response :success
    assert_empty response.parsed_body['data']['assign_rental_items']
  end

  test 'should get assignments with names and their logs' do
    get api_v1_get_assign_rental_items_for_rental_view_url,
        params: { rental_place_id: @assign_rental_item.rental_place_id, group_id: @group.id },
        headers: @headers

    assert_response :success
    assignments = response.parsed_body['data']['assign_rental_items']
    assert_equal 1, assignments.size

    assignment = assignments.first
    assert_equal @assign_rental_item.id, assignment['id']
    assert_equal @assign_rental_item.rental_item.name, assignment['rental_item_name']
    assert_equal @assign_rental_item.stock_place_name, assignment['stock_place_name']
    assert_equal @assign_rental_item.rental_place_name, assignment['rental_place_name']
    assert_equal @group.name, assignment['group_name']
    assert_equal @assign_rental_item.num, assignment['num']

    logs = assignment['item_rental_logs']
    assert_equal 1, logs.size
    assert_equal 'rental', logs.first['category']
    assert_equal 2, logs.first['quantity']
    assert_equal '1脚だけ脚がゆるい', logs.first['memo']
    assert_equal 'recorder@example.com', logs.first['recorder_email']
  end

  test 'should include the remark written by the committee' do
    @assign_rental_item.update!(remark: 'テント1・2')

    get api_v1_get_assign_rental_items_for_rental_view_url,
        params: { group_id: @group.id }, headers: @headers

    assert_response :success
    assignment = response.parsed_body['data']['assign_rental_items'].first
    assert_equal 'テント1・2', assignment['remark']
  end

  # addition / reduction は assign_rental_item に紐づかず貸出場所も持たないため、
  # 作業場所で絞っても取得できるよう assignment_change_logs として同梱する
  test 'should include assignment change logs even when filtered by rental place' do
    addition = ItemRentalLog.create!(
      uid: 'rental-view-addition-uid',
      group: @group,
      rental_item: @assign_rental_item.rental_item,
      stocker_place: @assign_rental_item.stocker_place,
      category: :addition,
      quantity: 5,
      recorder_email: 'recorder@example.com'
    )

    get api_v1_get_assign_rental_items_for_rental_view_url,
        params: { rental_place_id: @assign_rental_item.rental_place_id, group_id: @group.id },
        headers: @headers

    assert_response :success
    change_logs = response.parsed_body['data']['assignment_change_logs']
    assert_equal([addition.id], change_logs.pluck('id'))
    assert_equal 'addition', change_logs.first['category']
    assert_equal @assign_rental_item.rental_item_id, change_logs.first['rental_item_id']
    assert_equal @assign_rental_item.stocker_place_id, change_logs.first['stocker_place_id']
  end

  test 'assignment change logs are empty when no group is specified' do
    ItemRentalLog.create!(
      uid: 'rental-view-reduction-uid',
      group: @group,
      rental_item: @assign_rental_item.rental_item,
      stocker_place: @assign_rental_item.stocker_place,
      category: :reduction,
      quantity: 1,
      recorder_email: 'recorder@example.com'
    )

    get api_v1_get_assign_rental_items_for_rental_view_url,
        params: { rental_place_id: @assign_rental_item.rental_place_id }, headers: @headers

    assert_response :success
    assert_empty response.parsed_body['data']['assignment_change_logs']
  end

  test 'should not include logs from a different assignment' do
    ItemRentalLog.create!(
      uid: 'other-assignment-log-uid',
      assign_rental_item: @other_assign_rental_item,
      group: @other_assign_rental_item.group,
      rental_item: @other_assign_rental_item.rental_item,
      stocker_place: @other_assign_rental_item.stocker_place,
      category: :rental,
      quantity: 1,
      recorder_email: 'recorder@example.com'
    )

    get api_v1_get_assign_rental_items_for_rental_view_url,
        params: { group_id: @group.id }, headers: @headers

    assert_response :success
    assignments = response.parsed_body['data']['assign_rental_items']
    assert_equal([@assign_rental_item.id], assignments.pluck('id'))
    assert_equal([@log.id], assignments.first['item_rental_logs'].pluck('id'))
  end

  test 'assignments require the rental BFF token' do
    get api_v1_get_assign_rental_items_for_rental_view_url, params: { group_id: @group.id }
    assert_response :unauthorized
  end
end
