require 'test_helper'

class PlaceAllowListsControllerTest < ActionDispatch::IntegrationTest
  setup do
    @place_allow_list = place_allow_lists(:one)
  end

  test "should get index" do
    get place_allow_lists_url, as: :json
    assert_response :success
  end

  test "should create place_allow_list" do
    assert_difference('PlaceAllowList.count') do
      post place_allow_lists_url, params: { place_allow_list: { enable: @place_allow_list.enable, group_category_id: @place_allow_list.group_category_id, place_id: @place_allow_list.place_id } }, as: :json
    end

    assert_response 201
  end

  test "should show place_allow_list" do
    get place_allow_list_url(@place_allow_list), as: :json
    assert_response :success
  end

  test "should update place_allow_list" do
    patch place_allow_list_url(@place_allow_list), params: { place_allow_list: { enable: @place_allow_list.enable, group_category_id: @place_allow_list.group_category_id, place_id: @place_allow_list.place_id } }, as: :json
    assert_response 200
  end

  test "should destroy place_allow_list" do
    assert_difference('PlaceAllowList.count', -1) do
      delete place_allow_list_url(@place_allow_list), as: :json
    end

    assert_response 204
  end
end
