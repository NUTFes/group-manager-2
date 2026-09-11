# frozen_string_literal: true

require 'test_helper'

class UserDetailsControllerTest < ActionDispatch::IntegrationTest
  setup do
    @user_detail = user_details(:one)
  end

  test 'should get index' do
    get user_details_url, as: :json
    assert_response :success
  end

  test 'should create user_detail' do
    assert_difference('UserDetail.count') do
      post user_details_url, params: { user_detail: { department_id: @user_detail.department_id, grade_id: @user_detail.grade_id, tel: @user_detail.tel, user_id: @user_detail.user_id } }, as: :json
    end

    assert_response :created
  end

  test 'should show user_detail' do
    get user_detail_url(@user_detail), as: :json
    assert_response :success
  end

  test 'should update user_detail' do
    patch user_detail_url(@user_detail), params: { user_detail: { department_id: @user_detail.department_id, grade_id: @user_detail.grade_id, tel: @user_detail.tel, user_id: @user_detail.user_id } }, as: :json
    assert_response :ok
  end

  test 'should destroy user_detail' do
    assert_difference('UserDetail.count', -1) do
      delete user_detail_url(@user_detail), as: :json
    end

    assert_response :no_content
  end
end
