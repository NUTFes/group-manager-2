require 'test_helper'

class SubRepsControllerTest < ActionDispatch::IntegrationTest
  setup do
    @sub_rep = sub_reps(:one)
  end

  test "should get index" do
    get sub_reps_url, as: :json
    assert_response :success
  end

  test "should create sub_rep" do
    assert_difference('SubRep.count') do
      post sub_reps_url, params: { sub_rep: { department_id: @sub_rep.department_id, email: @sub_rep.email, grade_id: @sub_rep.grade_id, group_id: @sub_rep.group_id, name: @sub_rep.name, tel: @sub_rep.tel } }, as: :json
    end

    assert_response 201
  end

  test "should show sub_rep" do
    get sub_rep_url(@sub_rep), as: :json
    assert_response :success
  end

  test "should update sub_rep" do
    patch sub_rep_url(@sub_rep), params: { sub_rep: { department_id: @sub_rep.department_id, email: @sub_rep.email, grade_id: @sub_rep.grade_id, group_id: @sub_rep.group_id, name: @sub_rep.name, tel: @sub_rep.tel } }, as: :json
    assert_response 200
  end

  test "should destroy sub_rep" do
    assert_difference('SubRep.count', -1) do
      delete sub_rep_url(@sub_rep), as: :json
    end

    assert_response 204
  end
end
