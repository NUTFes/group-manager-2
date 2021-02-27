require 'test_helper'

class UserPageSettingsControllerTest < ActionDispatch::IntegrationTest
  setup do
    @user_page_setting = user_page_settings(:one)
  end

  test "should get index" do
    get user_page_settings_url, as: :json
    assert_response :success
  end

  test "should create user_page_setting" do
    assert_difference('UserPageSetting.count') do
      post user_page_settings_url, params: { user_page_setting: { is_edit_employee: @user_page_setting.is_edit_employee, is_edit_food_product: @user_page_setting.is_edit_food_product, is_edit_group: @user_page_setting.is_edit_group, is_edit_place: @user_page_setting.is_edit_place, is_edit_power_order: @user_page_setting.is_edit_power_order, is_edit_purchase_list: @user_page_setting.is_edit_purchase_list, is_edit_rental_order: @user_page_setting.is_edit_rental_order, is_edit_stage_order: @user_page_setting.is_edit_stage_order, is_edit_sub_rep: @user_page_setting.is_edit_sub_rep, is_regist_food_product: @user_page_setting.is_regist_food_product, is_regist_group: @user_page_setting.is_regist_group } }, as: :json
    end

    assert_response 201
  end

  test "should show user_page_setting" do
    get user_page_setting_url(@user_page_setting), as: :json
    assert_response :success
  end

  test "should update user_page_setting" do
    patch user_page_setting_url(@user_page_setting), params: { user_page_setting: { is_edit_employee: @user_page_setting.is_edit_employee, is_edit_food_product: @user_page_setting.is_edit_food_product, is_edit_group: @user_page_setting.is_edit_group, is_edit_place: @user_page_setting.is_edit_place, is_edit_power_order: @user_page_setting.is_edit_power_order, is_edit_purchase_list: @user_page_setting.is_edit_purchase_list, is_edit_rental_order: @user_page_setting.is_edit_rental_order, is_edit_stage_order: @user_page_setting.is_edit_stage_order, is_edit_sub_rep: @user_page_setting.is_edit_sub_rep, is_regist_food_product: @user_page_setting.is_regist_food_product, is_regist_group: @user_page_setting.is_regist_group } }, as: :json
    assert_response 200
  end

  test "should destroy user_page_setting" do
    assert_difference('UserPageSetting.count', -1) do
      delete user_page_setting_url(@user_page_setting), as: :json
    end

    assert_response 204
  end
end
