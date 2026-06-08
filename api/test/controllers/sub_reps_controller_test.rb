# frozen_string_literal: true

require 'test_helper'

class SubRepsControllerTest < ActionDispatch::IntegrationTest
  setup do
    @sub_rep = sub_reps(:one)
  end

  test 'should get index' do
    get sub_reps_url, as: :json
    assert_response :unauthorized
  end

  test 'should create sub_rep' do
    assert_difference('SubRep.count') do
      post sub_reps_url, params: { department_id: @sub_rep.department_id, email: @sub_rep.email, grade_id: @sub_rep.grade_id, group_id: @sub_rep.group_id, name: @sub_rep.name, tel: @sub_rep.tel }, as: :json
    end

    assert_response :success
  end

  test 'should show sub_rep' do
    get sub_rep_url(@sub_rep), as: :json
    assert_response :unauthorized
  end

  test 'should update sub_rep' do
    patch sub_rep_url(@sub_rep), params: { department_id: @sub_rep.department_id, email: @sub_rep.email, grade_id: @sub_rep.grade_id, group_id: @sub_rep.group_id, name: @sub_rep.name, tel: @sub_rep.tel }, as: :json
    assert_response :ok
  end

  test 'should destroy sub_rep' do
    assert_difference('SubRep.count', -1) do
      delete sub_rep_url(@sub_rep), as: :json
    end

    assert_response :ok
  end

  test 'should not create sub_rep with invalid params' do
    assert_no_difference('SubRep.count') do
      post sub_reps_url, params: { group_id: nil, department_id: nil, grade_id: nil }, as: :json
    end
    assert_response :unprocessable_entity
  end

  test 'should not update sub_rep with invalid id' do
    patch sub_rep_url(99999), params: { name: @sub_rep.name }, as: :json
    assert_response :not_found
  end

  test 'should not destroy sub_rep with invalid id' do
    assert_no_difference('SubRep.count') do
      delete sub_rep_url(99999), as: :json
    end
    assert_response :not_found
  end
end
