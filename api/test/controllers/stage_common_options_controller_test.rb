require 'test_helper'

class StageCommonOptionsControllerTest < ActionDispatch::IntegrationTest
  setup do
    @stage_common_option = stage_common_options(:one)
  end

  test "should get index" do
    get stage_common_options_url, as: :json
    assert_response :success
  end

  test "should create stage_common_option" do
    assert_difference('StageCommonOption.count') do
      post stage_common_options_url, params: { stage_common_option: { bgm: @stage_common_option.bgm, camera_permission: @stage_common_option.camera_permission, group_id: @stage_common_option.group_id, loud_sound: @stage_common_option.loud_sound, own_equipment: @stage_common_option.own_equipment, stage_content: @stage_common_option.stage_content } }, as: :json
    end

    assert_response 201
  end

  test "should show stage_common_option" do
    get stage_common_option_url(@stage_common_option), as: :json
    assert_response :success
  end

  test "should update stage_common_option" do
    patch stage_common_option_url(@stage_common_option), params: { stage_common_option: { bgm: @stage_common_option.bgm, camera_permission: @stage_common_option.camera_permission, group_id: @stage_common_option.group_id, loud_sound: @stage_common_option.loud_sound, own_equipment: @stage_common_option.own_equipment, stage_content: @stage_common_option.stage_content } }, as: :json
    assert_response 200
  end

  test "should destroy stage_common_option" do
    assert_difference('StageCommonOption.count', -1) do
      delete stage_common_option_url(@stage_common_option), as: :json
    end

    assert_response 204
  end
end
