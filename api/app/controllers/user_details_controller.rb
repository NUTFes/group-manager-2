# frozen_string_literal: true

class UserDetailsController < ApplicationController
  before_action :authenticate_api_user!
  before_action :require_own_user_id!, only: %i[index create update]
  before_action :set_user_detail, only: %i[show update destroy]

  # GET /user_details
  # GET /user_details.json
  def index
    @user_details = if params[:user_id]
                      UserDetail.find_by(user_id: params[:user_id].to_i)
                    else
                      accessible_user_details
                    end

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
    @user_detail = UserDetail.create(user_detail_params)
    render json: fmt(created, @user_detail)
  end

  # PATCH/PUT /user_details/1
  # PATCH/PUT /user_details/1.json
  def update
    @user_detail.update(user_detail_params)
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
    @user_detail = accessible_user_details.find_by(id: params[:id])
    return if @user_detail

    render_not_found_or_forbidden { render json: fmt(not_found, [], "Not found user_detail = #{params[:id]}") }
  end

  # adminは全ユーザー、それ以外は自分のユーザー詳細だけ
  def accessible_user_details
    admin_user? ? UserDetail.all : UserDetail.where(user_id: current_api_user.id)
  end

  # Only allow a list of trusted parameters through.
  def user_detail_params
    params.permit(:tel, :grade_id, :department_id, :user_id, :student_id)
  end
end
