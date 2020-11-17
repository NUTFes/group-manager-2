require 'test_helper'

class AssignStagesControllerTest < ActionDispatch::IntegrationTest
  setup do
    @assign_stage = assign_stages(:one)
  end

  test "should get index" do
    get assign_stages_url, as: :json
    assert_response :success
  end

  test "should create assign_stage" do
    assert_difference('AssignStage.count') do
      post assign_stages_url, params: { assign_stage: { stage_id: @assign_stage.stage_id, stage_order_id: @assign_stage.stage_order_id, time_point_end: @assign_stage.time_point_end, time_point_start: @assign_stage.time_point_start } }, as: :json
    end

    assert_response 201
  end

  test "should show assign_stage" do
    get assign_stage_url(@assign_stage), as: :json
    assert_response :success
  end

  test "should update assign_stage" do
    patch assign_stage_url(@assign_stage), params: { assign_stage: { stage_id: @assign_stage.stage_id, stage_order_id: @assign_stage.stage_order_id, time_point_end: @assign_stage.time_point_end, time_point_start: @assign_stage.time_point_start } }, as: :json
    assert_response 200
  end

  test "should destroy assign_stage" do
    assert_difference('AssignStage.count', -1) do
      delete assign_stage_url(@assign_stage), as: :json
    end

    assert_response 204
  end
end
