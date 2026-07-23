# frozen_string_literal: true

class UserDetailsController < ApplicationController
  before_action :set_user_detail, only: %i[show update destroy]

  before_action :authenticate_api_user!, only: %i[index show]

  # GET /user_details
  # GET /user_details.json
  def index
    requested_user_id = params[:user_id].presence&.to_i
    return render_user_detail_not_found if requested_user_id && requested_user_id != current_api_user.id

    @user_details = current_api_user.user_detail

    render json: fmt(ok, @user_details)
  end

  # GET /user_details/1
  # GET /user_details/1.json
  def show
    render json: fmt(ok, @user_detail)
  end

  # POST /user_details
  # POST /user_details.json
  def create
    @user_detail = UserDetail.create(user_detail_params.merge(user_id: current_api_user.id))
    render json: fmt(created, @user_detail)
  end

  # PATCH/PUT /user_details/1
  # PATCH/PUT /user_details/1.json
  def update
    @user_detail.update(user_detail_params.except(:user_id))
    render json: fmt(created, @user_detail, "Updated user_detail id = #{params[:id]}")
  end

  # DELETE /user_details/1
  # DELETE /user_details/1.json
  def destroy
    @user_detail.destroy
    render json: fmt(ok, [], "Deleted user_detail = #{params[:id]}")
  end

  private

  # Use callbacks to share common setup or constraints between actions.
  def set_user_detail
    @user_detail = current_api_user.user_detail
    render_user_detail_not_found unless @user_detail&.id == params[:id].to_i
  end

  def render_user_detail_not_found
    render json: fmt(not_found, [], 'Not Found'), status: :not_found
  end

  # Only allow a list of trusted parameters through.
  def user_detail_params
    params.permit(:tel, :grade_id, :department_id, :user_id, :student_id)
  end
end
