# frozen_string_literal: true

require 'test_helper'

class UserPageSettingsControllerTest < ActionDispatch::IntegrationTest
  setup do
    @user_page_setting = user_page_settings(:one)
  end

  test 'should get index' do
    get user_page_settings_url, as: :json
    assert_response :success
  end

  test 'should create user_page_setting' do
    assert_difference('UserPageSetting.count') do
      post user_page_settings_url, params: { fes_year_id: fes_years(:one).id, is_edit_employee: @user_page_setting.is_edit_employee, is_edit_food_product: @user_page_setting.is_edit_food_product, is_edit_group: @user_page_setting.is_edit_group, is_edit_place: @user_page_setting.is_edit_place, is_edit_power_order: @user_page_setting.is_edit_power_order, is_edit_purchase_list: @user_page_setting.is_edit_purchase_list, is_edit_rental_order: @user_page_setting.is_edit_rental_order, is_edit_stage_order: @user_page_setting.is_edit_stage_order, is_edit_sub_rep: @user_page_setting.is_edit_sub_rep, is_regist_food_product: @user_page_setting.is_regist_food_product, is_regist_group: @user_page_setting.is_regist_group }, as: :json
    end

    assert_response :ok
  end

  test 'should show user_page_setting' do
    get user_page_setting_url(@user_page_setting), as: :json
    assert_response :success
  end

  test 'should update user_page_setting' do
    patch user_page_setting_url(@user_page_setting), params: { is_edit_employee: true }, as: :json
    assert_response :ok
    assert_equal 200, response.parsed_body.dig('status', 'code')
    assert @user_page_setting.reload.is_edit_employee
    assert_not @user_page_setting.is_edit_food_product
  end

  test 'should update festival year without changing toggle flags' do
    patch user_page_setting_url(@user_page_setting), params: { fes_year_id: fes_years(:two).id }, as: :json

    assert_response :ok
    assert_equal fes_years(:two).id, @user_page_setting.reload.fes_year_id
    assert_not @user_page_setting.is_edit_employee
  end

  test 'should reject an invalid festival year without changing the setting' do
    previous_year_id = @user_page_setting.fes_year_id

    patch user_page_setting_url(@user_page_setting), params: { fes_year_id: FesYear.maximum(:id) + 1 }, as: :json

    assert_response :unprocessable_entity
    assert_equal 422, response.parsed_body.dig('status', 'code')
    assert_equal previous_year_id, @user_page_setting.reload.fes_year_id
  end

  test 'should return not found for an unknown setting' do
    patch user_page_setting_url(UserPageSetting.maximum(:id) + 1), params: { is_edit_employee: true }, as: :json

    assert_response :not_found
    assert_equal 404, response.parsed_body.dig('status', 'code')
  end

  test 'should destroy user_page_setting' do
    assert_difference('UserPageSetting.count', -1) do
      delete user_page_setting_url(@user_page_setting), as: :json
    end

    assert_response :ok
  end
end
