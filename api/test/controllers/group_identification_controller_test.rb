require "test_helper"

class GroupIdentificationControllerTest < ActionDispatch::IntegrationTest
  test "should get create" do
    get group_identification_create_url
    assert_response :success
  end

  test "should get update" do
    get group_identification_update_url
    assert_response :success
  end

  test "should get destroy" do
    get group_identification_destroy_url
    assert_response :success
  end
end
