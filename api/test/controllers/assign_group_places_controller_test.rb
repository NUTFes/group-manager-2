require 'test_helper'

class AssignGroupPlacesControllerTest < ActionDispatch::IntegrationTest
  setup do
    @assign_group_place = assign_group_places(:one)
  end

  test "should get index" do
    get assign_group_places_url, as: :json
    assert_response :success
  end

  test "should create assign_group_place" do
    assert_difference('AssignGroupPlace.count') do
      post assign_group_places_url, params: { assign_group_place: { place_id: @assign_group_place.place_id, place_order_id: @assign_group_place.place_order_id } }, as: :json
    end

    assert_response 201
  end

  test "should show assign_group_place" do
    get assign_group_place_url(@assign_group_place), as: :json
    assert_response :success
  end

  test "should update assign_group_place" do
    patch assign_group_place_url(@assign_group_place), params: { assign_group_place: { place_id: @assign_group_place.place_id, place_order_id: @assign_group_place.place_order_id } }, as: :json
    assert_response 200
  end

  test "should destroy assign_group_place" do
    assert_difference('AssignGroupPlace.count', -1) do
      delete assign_group_place_url(@assign_group_place), as: :json
    end

    assert_response 204
  end
end
