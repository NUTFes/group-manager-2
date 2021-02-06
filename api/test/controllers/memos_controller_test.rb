require 'test_helper'

class MemosControllerTest < ActionDispatch::IntegrationTest
  setup do
    @memo = memos(:one)
  end

  test "should get index" do
    get memos_url, as: :json
    assert_response :success
  end

  test "should create memo" do
    assert_difference('Memo.count') do
      post memos_url, params: { memo: { content: @memo.content, user_id: @memo.user_id } }, as: :json
    end

    assert_response 201
  end

  test "should show memo" do
    get memo_url(@memo), as: :json
    assert_response :success
  end

  test "should update memo" do
    patch memo_url(@memo), params: { memo: { content: @memo.content, user_id: @memo.user_id } }, as: :json
    assert_response 200
  end

  test "should destroy memo" do
    assert_difference('Memo.count', -1) do
      delete memo_url(@memo), as: :json
    end

    assert_response 204
  end
end
