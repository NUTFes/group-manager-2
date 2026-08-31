# frozen_string_literal: true

require 'test_helper'

class AssignRentalItemsControllerTest < ActionDispatch::IntegrationTest
  setup do
    @assign_rental_item = assign_rental_items(:one)
    @stocker_place = stocker_places(:with_name_en)
  end

  test 'should get index' do
    get assign_rental_items_url, as: :json

    assert_response :success
    response_data = response.parsed_body.fetch('data')
    assert_equal '長岡高専A', response_data.find { |item| item['id'] == @assign_rental_item.id }.fetch('remark')
  end

  # createは物品ID・在庫場所IDを1つ受け取り、items配列の団体ごとに割当を作る形式
  test 'should create assign_rental_items with remark' do
    assert_difference('AssignRentalItem.count', 2) do
      post assign_rental_items_url,
           params: {
             rentalItemId: @assign_rental_item.rental_item_id,
             stockerPlaceId: @stocker_place.id,
             items: [
               { group_id: groups(:one).id, num: 3, remark: '1、2、長岡高専A' },
               { group_id: groups(:two).id, num: 5 }
             ]
           },
           as: :json
    end

    assert_response :success
    assert_includes response.headers['Content-Type'], 'application/json'
    assert_equal 201, response.parsed_body.dig('status', 'code')

    created = AssignRentalItem.order(:id).last(2)
    assert_equal [groups(:one).id, groups(:two).id], created.map(&:group_id)
    assert_equal [3, 5], created.map(&:num)
    assert_equal [@assign_rental_item.rental_item_id] * 2, created.map(&:rental_item_id)
    assert_equal [@stocker_place.id] * 2, created.map(&:stocker_place_id)
    assert_equal ['1、2、長岡高専A', nil], created.map(&:remark)
    assert_equal '1、2、長岡高専A', response.parsed_body.dig('data', 0, 'remark')
  end

  # 途中で失敗した場合、それまでに作られた割当も残らないこと（トランザクション）
  test 'should not create any assign_rental_item when one of the items is invalid' do
    assert_no_difference('AssignRentalItem.count') do
      post assign_rental_items_url,
           params: {
             rentalItemId: @assign_rental_item.rental_item_id,
             stockerPlaceId: @stocker_place.id,
             items: [
               { group_id: groups(:one).id, num: 1, remark: '保存されない備考' },
               { group_id: unknown_group_id, num: 1 }
             ]
           },
           as: :json
    end

    assert_equal 500, response.parsed_body.dig('status', 'code')
  end

  test 'should show assign_rental_item' do
    get assign_rental_item_url(@assign_rental_item), as: :json

    assert_response :success
    assert_equal 200, response.parsed_body.dig('status', 'code')
    assert_equal '長岡高専A', response.parsed_body.dig('data', 'remark')
  end

  # updateはネストさせず、トップレベルのパラメータを受け取る
  test 'should update assign_rental_item' do
    new_num = @assign_rental_item.num + 1

    patch assign_rental_item_url(@assign_rental_item),
          params: { num: new_num, group_id: groups(:two).id },
          as: :json

    assert_response :ok
    assert_equal new_num, @assign_rental_item.reload.num
    assert_equal groups(:two).id, @assign_rental_item.group_id
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

    # destroyは204ではなく、削除結果をJSONで返す実装になっている
    assert_response :success
    assert_includes response.headers['Content-Type'], 'application/json'
    assert_equal 200, response.parsed_body.dig('status', 'code')
  end

  # 存在しないIDの場合、HTTPステータスは200のままレスポンス本文で404を返す実装になっている
  test 'should respond not found in the body for a nonexistent id' do
    %i[get patch delete].each do |verb|
      send(verb, assign_rental_item_url(unknown_assign_rental_item_id), as: :json)

      assert_response :success
      assert_equal 404, response.parsed_body.dig('status', 'code'), "#{verb} のレスポンス"
    end
  end

  private

  def unknown_assign_rental_item_id
    AssignRentalItem.maximum(:id).to_i + 1000
  end

  def unknown_group_id
    Group.maximum(:id).to_i + 1000
  end
end
