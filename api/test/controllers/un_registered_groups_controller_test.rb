# frozen_string_literal: true

require 'test_helper'

class UnRegisteredGroupsControllerTest < ActionDispatch::IntegrationTest
  # NOTE: 一部の既存フィクスチャ（employees, assign_rental_items 等）が
  # スキーマと乖離しており fixtures :all のままだと setup 時点で読み込みに失敗するため、
  # このテストに必要なフィクスチャのみに限定する。
  self.fixture_table_names = %w[users groups un_registered_groups]

  setup do
    @un_registered_group = un_registered_groups(:one)
    @other_un_registered_group = un_registered_groups(:two)
  end

  test 'should get index without group_id filter' do
    get un_registered_groups_url, as: :json
    assert_response :success

    body = response.parsed_body
    ids = body['data'].pluck('id')
    assert_includes ids, @un_registered_group.id
    assert_includes ids, @other_un_registered_group.id
  end

  test 'should get index filtered by group_id' do
    # NOTE: GET + as: :json + params は Rails のテストヘルパーが
    # X-Http-Method-Override 付きの POST に変換してしまうため、
    # クエリパラメータ付きの GET では as: :json を付けない。
    get un_registered_groups_url, params: { group_id: @un_registered_group.group_id }
    assert_response :success

    body = response.parsed_body
    ids = body['data'].pluck('id')
    assert_includes ids, @un_registered_group.id
    assert_not_includes ids, @other_un_registered_group.id
  end

  test 'index filtered by group_id with no matching records returns empty array' do
    get un_registered_groups_url, params: { group_id: 0 }
    assert_response :success

    body = response.parsed_body
    assert_equal [], body['data']
  end

  test 'should create un_registered_group' do
    assert_difference('UnRegisteredGroup.count') do
      post un_registered_groups_url,
           params: { un_registered_group: { group_id: groups(:one).id, order_type: 'sub_rep' } },
           as: :json
    end

    assert_response :created
  end

  test 'should not create un_registered_group without required params' do
    assert_no_difference('UnRegisteredGroup.count') do
      post un_registered_groups_url, params: { un_registered_group: { group_id: nil, order_type: nil } }, as: :json
    end

    assert_response :not_found
  end

  test 'should show un_registered_group' do
    get un_registered_group_url(@un_registered_group), as: :json
    assert_response :success
  end

  test 'should get by group and order_type' do
    get group_un_registered_groups_url,
        params: { group_id: @un_registered_group.group_id, order_type: @un_registered_group.order_type }
    assert_response :success

    body = response.parsed_body
    ids = body['data'].pluck('id')
    assert_includes ids, @un_registered_group.id
  end

  test 'group action returns not found body when no records match' do
    get group_un_registered_groups_url,
        params: { group_id: @un_registered_group.group_id, order_type: 'fire_equipment_order' }
    assert_response :success

    body = response.parsed_body
    assert_equal 404, body['status']['code']
    assert_equal [], body['data']
  end

  test 'should destroy un_registered_group' do
    assert_difference('UnRegisteredGroup.count', -1) do
      delete un_registered_group_url(@un_registered_group), as: :json
    end
  end
end
