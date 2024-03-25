class UserPageSettingsController < ApplicationController
  before_action :set_user_page_setting, only: [:show, :update, :destroy]

  # GET /user_page_settings
  # GET /user_page_settings.json
  def index
    @user_page_settings = UserPageSetting.all
    render json: fmt(ok, @user_page_settings)
  end

  # GET /user_page_settings/1
  # GET /user_page_settings/1.json
  def show
    render json: fmt(ok, @user_page_setting)
  end

  # POST /user_page_settings
  # POST /user_page_settings.json
  def create
    @user_page_setting = UserPageSetting.create(user_page_setting_params)
    render json: fmt(created, @user_page_setting)
  end

  # PATCH/PUT /user_page_settings/1
  # PATCH/PUT /user_page_settings/1.json
  def update
    @user_page_setting.update(user_page_setting_params)
    render json: fmt(created, @user_page_setting, "Updated user_page_setting id = "+params[:id])
  end

  # DELETE /user_page_settings/1
  # DELETE /user_page_settings/1.json
  def destroy
    @user_page_setting.destroy
    render json: fmt(ok, [], "Deleted user_page_setting = "+params[:id])
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_user_page_setting
      if UserPageSetting.exists?(params[:id])
        @user_page_setting = UserPageSetting.find(params[:id])
      else
        render json: fmt(not_found, [], "Not found user_page_setting = "+params[:id])
      end
    end

    # Only allow a list of trusted parameters through.
    def user_page_setting_params
      params.permit(:is_regist_group, :is_regist_food_product, :is_edit_group, :is_edit_sub_rep, :is_edit_place, :is_edit_power_order, :is_edit_rental_order, :is_edit_stage_order, :is_edit_employee, :is_edit_food_product, :is_edit_purchase_list,:add_power_order,:add_rental_order,:add_employee,:add_food_product,:add_purchase_list, :fes_year_id, :is_edit_announcement, :add_announcement, :is_edit_user, :is_edit_stage_common_option, :is_edit_public_relation, :is_edit_venue_map, :is_edit_cooking_process, :add_stage_order)
    end
end
