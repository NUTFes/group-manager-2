require "test_helper"

class CurrentStocksControllerTest < ActionDispatch::IntegrationTest
  test "should get index" do
    get current_stocks_index_url
    assert_response :success
  end

  test "should get show" do
    get current_stocks_show_url
    assert_response :success
  end

  test "should get new" do
    get current_stocks_new_url
    assert_response :success
  end

  test "should get edit" do
    get current_stocks_edit_url
    assert_response :success
  end
end
