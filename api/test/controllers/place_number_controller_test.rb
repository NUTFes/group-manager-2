require "test_helper"

class PlaceNumberControllerTest < ActionDispatch::IntegrationTest
  test "should get index" do
    get place_number_index_url
    assert_response :success
  end

  test "should get show" do
    get place_number_show_url
    assert_response :success
  end

  test "should get create" do
    get place_number_create_url
    assert_response :success
  end

  test "should get update" do
    get place_number_update_url
    assert_response :success
  end

  test "should get destroy" do
    get place_number_destroy_url
    assert_response :success
  end
end
