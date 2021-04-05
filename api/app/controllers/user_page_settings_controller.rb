class UserPageSettingsController < ApplicationController
  before_action :set_user_page_setting, only: [:show, :update, :destroy]

  # GET /user_page_settings
  # GET /user_page_settings.json
  def index
    @user_page_settings = UserPageSetting.all
    render json: @user_page_settings
  end

  # GET /user_page_settings/1
  # GET /user_page_settings/1.json
  def show
    render json: @user_page_setting
  end

  # POST /user_page_settings
  # POST /user_page_settings.json
  def create
    @user_page_setting = UserPageSetting.new(user_page_setting_params)
    @user_page_setting.save
    render json: @user_page_setting
  end

  # PATCH/PUT /user_page_settings/1
  # PATCH/PUT /user_page_settings/1.json
  def update
    @user_page_setting.update(user_page_setting_params)
    render json: @user_page_setting
  end

  # DELETE /user_page_settings/1
  # DELETE /user_page_settings/1.json
  def destroy
    @user_page_setting.destroy
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_user_page_setting
      @user_page_setting = UserPageSetting.find(params[:id])
    end

    # Only allow a list of trusted parameters through.
    def user_page_setting_params
      params.permit(:is_regist_group, :is_edit_group, :is_edit_sub_rep, :is_edit_place, :is_edit_power_order, :is_edit_rental_order, :is_edit_stage_order, :is_edit_employee, :is_edit_food_product, :is_edit_purchase_list,:add_power_order,:add_rental_order,:add_employee,:add_food_product,:add_purchase_list, :fes_year_id)
    end
end
