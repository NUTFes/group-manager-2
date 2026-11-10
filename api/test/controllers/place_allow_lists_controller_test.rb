# frozen_string_literal: true

require 'test_helper'

class PlaceAllowListsControllerTest < ActionDispatch::IntegrationTest
  setup do
    @place_allow_list = place_allow_lists(:one)
  end

  test 'should get index' do
    get place_allow_lists_url, headers: api_auth_headers, as: :json
    assert_response :success
  end

  test 'should create place_allow_list' do
    assert_difference('PlaceAllowList.count') do
      post place_allow_lists_url, headers: api_auth_headers, params: { place_allow_list: { enable: @place_allow_list.enable, group_category_id: @place_allow_list.group_category_id, place_id: @place_allow_list.place_id } }, as: :json
    end

    assert_response :created
  end

  test 'should show place_allow_list' do
    get place_allow_list_url(@place_allow_list), headers: api_auth_headers, as: :json
    assert_response :success
  end

  test 'should update place_allow_list' do
    patch place_allow_list_url(@place_allow_list), headers: api_auth_headers, params: { place_allow_list: { enable: @place_allow_list.enable, group_category_id: @place_allow_list.group_category_id, place_id: @place_allow_list.place_id } }, as: :json
    assert_response :ok
  end

  test 'should destroy place_allow_list' do
    assert_difference('PlaceAllowList.count', -1) do
      delete place_allow_list_url(@place_allow_list), headers: api_auth_headers, as: :json
    end

    assert_response :no_content
  end
end
