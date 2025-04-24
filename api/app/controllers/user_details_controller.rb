class UserDetailsController < ApplicationController
  before_action :set_user_detail, only: [:show, :update, :destroy]

  # GET /user_details
  # GET /user_details.json
  def index
    if params[:user_id]
      @user_details = UserDetail.find_by(user_id: params[:user_id].to_i)
    else
      @user_details = UserDetail.all
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
    render json: fmt(created, @user_detail, "Updated user_detail id = "+params[:id])
  end

  # DELETE /user_details/1
  # DELETE /user_details/1.json
  def destroy
    @user_detail.destroy
    render json: fmt(ok, [], "Deleted user_detail = "+params[:id])
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_user_detail
      if UserDetail.exists?(params[:id])
        @user_detail = UserDetail.find(params[:id])
      else
        render json: fmt(not_found, [], "Not found user_detail = "+params[:id])
      end
    end

    # Only allow a list of trusted parameters through.
    def user_detail_params
      params.permit(:tel, :grade_id, :department_id, :user_id, :student_id)
    end
end
