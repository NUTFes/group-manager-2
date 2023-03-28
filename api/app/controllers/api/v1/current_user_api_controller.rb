class Api::V1::CurrentUserApiController < ApplicationController
  #  before_action :authenticate_api_user!
  
  # ログインユーザーの登録情報を全て取得する
  def current_regist_info
    @user = current_api_user
    @groups = @user.with_regist_info
    render json: fmt(ok, @groups)
  end

  def password_reset 
    @user = current_api_user
    @user.password = password_reset_params[:password]
    @user.password_confirmation = password_reset_params[:password_confirmation]
    @user.save!
  end

  def get_current_user_with_user_detail
    @user = current_api_user
    @user_detail = @user.with_user_detail
    render json: fmt(ok, @user_detail)
  end

  def edit_user_info
    @user = current_api_user
		@user_detail = @user.user_detail
    @user.name = edit_user_info_params[:name]
    @user.email = edit_user_info_params[:email]
    @user_detail.student_id = edit_user_info_params[:student_id]
    @user_detail.tel = edit_user_info_params[:tel]
    @user_detail.department_id = edit_user_info_params[:department_id]
    @user_detail.grade_id = edit_user_info_params[:grade_id]
    @user.save!
		@user_detail.save!
  end

  def is_login
    @user = current_api_user
    if @user
      render json: true
    else
      render json: false
    end
  end

  private
    def edit_user_info_params
      params.permit(:name, :email, :student_id, :tel, :department_id, :grade_id)
    end

    def password_reset_params
      params.permit(:password, :password_confirmation)
    end
end
