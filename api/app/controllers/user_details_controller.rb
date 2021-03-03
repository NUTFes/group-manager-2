class UserDetailsController < ApplicationController
  before_action :set_user_detail, only: [:show, :update, :destroy]

  # GET /user_details
  # GET /user_details.json
  def index
    @user_details = UserDetail.all
    render json: @user_details
  end

  # GET /user_details/1
  # GET /user_details/1.json
  def show
    render json: @user_detail
  end

  # POST /user_details
  # POST /user_details.json
  def create
    @user_detail = UserDetail.new(user_detail_params)
    @user_detail.save
    render json: @user_detail
  end

  # PATCH/PUT /user_details/1
  # PATCH/PUT /user_details/1.json
  def update
    @user_detail.update(user_detail_params)
    render json: @user_detail
  end

  # DELETE /user_details/1
  # DELETE /user_details/1.json
  def destroy
    @user_detail.destroy
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_user_detail
      @user_detail = UserDetail.find(params[:id])
    end

    # Only allow a list of trusted parameters through.
    def user_detail_params
      params.permit(:tel, :grade_id, :department_id, :user_id, :student_id)
    end
end
