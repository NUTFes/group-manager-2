# frozen_string_literal: true

require 'test_helper'

class StageCommonOptionsControllerTest < ActionDispatch::IntegrationTest
  # NOTE: 一部の既存フィクスチャ（employees, assign_rental_items 等）が
  # スキーマと乖離しており fixtures :all のままだと setup 時点で読み込みに失敗するため、
  # このテストに必要なフィクスチャのみに限定する。
  self.fixture_table_names = %w[groups stage_common_options]

  setup do
    @stage_common_option = stage_common_options(:one)
  end

  test 'should get index' do
    get stage_common_options_url, as: :json
    assert_response :success
  end

  test 'should create stage_common_option' do
    assert_difference('StageCommonOption.count') do
      post stage_common_options_url, params: { bgm: @stage_common_option.bgm, camera_permission: @stage_common_option.camera_permission, group_id: @stage_common_option.group_id, loud_sound: @stage_common_option.loud_sound, own_equipment: @stage_common_option.own_equipment }, as: :json
    end

    assert_response :ok
  end

  test 'should not create stage_common_option with invalid group_id' do
    assert_no_difference('StageCommonOption.count') do
      post stage_common_options_url, params: { bgm: @stage_common_option.bgm, camera_permission: @stage_common_option.camera_permission, group_id: 0, loud_sound: @stage_common_option.loud_sound, own_equipment: @stage_common_option.own_equipment }, as: :json
    end

    assert_response :unprocessable_entity
    body = response.parsed_body
    assert_includes body['status']['option'], 'Group'
  end

  test 'should show stage_common_option' do
    get stage_common_option_url(@stage_common_option), as: :json
    assert_response :success
  end

  test 'should update stage_common_option' do
    patch stage_common_option_url(@stage_common_option), params: { bgm: @stage_common_option.bgm, camera_permission: @stage_common_option.camera_permission, group_id: @stage_common_option.group_id, loud_sound: @stage_common_option.loud_sound, own_equipment: @stage_common_option.own_equipment }, as: :json
    assert_response :ok
  end

  test 'should not update stage_common_option with invalid group_id' do
    patch stage_common_option_url(@stage_common_option), params: { bgm: @stage_common_option.bgm, camera_permission: @stage_common_option.camera_permission, group_id: 0, loud_sound: @stage_common_option.loud_sound, own_equipment: @stage_common_option.own_equipment }, as: :json
    assert_response :unprocessable_entity
  end

  test 'should destroy stage_common_option' do
    assert_difference('StageCommonOption.count', -1) do
      delete stage_common_option_url(@stage_common_option), as: :json
    end

    assert_response :ok
  end
end
