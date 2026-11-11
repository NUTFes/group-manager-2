# frozen_string_literal: true

require 'test_helper'

class AssignStagesControllerTest < ActionDispatch::IntegrationTest
  setup do
    @assign_stage = assign_stages(:one)
  end

  test 'should get index' do
    get assign_stages_url, headers: api_auth_headers, as: :json
    assert_response :success
  end

  test 'should create assign_stage' do
    assert_difference('AssignStage.count') do
      post assign_stages_url, headers: api_auth_headers, params: { assign_stage: { stage_id: @assign_stage.stage_id, stage_order_id: @assign_stage.stage_order_id, time_point_end: @assign_stage.time_point_end, time_point_start: @assign_stage.time_point_start } }, as: :json
    end

    assert_response :created
  end

  test 'should show assign_stage' do
    get assign_stage_url(@assign_stage), headers: api_auth_headers, as: :json
    assert_response :success
  end

  test 'should update assign_stage' do
    patch assign_stage_url(@assign_stage), headers: api_auth_headers, params: { assign_stage: { stage_id: @assign_stage.stage_id, stage_order_id: @assign_stage.stage_order_id, time_point_end: @assign_stage.time_point_end, time_point_start: @assign_stage.time_point_start } }, as: :json
    assert_response :ok
  end

  test 'should destroy assign_stage' do
    assert_difference('AssignStage.count', -1) do
      delete assign_stage_url(@assign_stage), headers: api_auth_headers, as: :json
    end

    assert_response :no_content
  end
end
