class Api::V1::UsersController < ApplicationController
  # before_action :authenticate_api_user!

  def index

    @users = User.all
    render json: { status: 'SUCCESS', message: 'Loaded users', data: @users }
  end
  
  def show
    @user = current_api_user
    render json: { data: @user }
  end

  def show_user_detail
    @user = User.find(params[:id])
    @role = @user.role.name
    @grade = @user.user_detail.grade.name
    @department = @user.user_detail.department.name
    @detail = @user.user_detail
    user_detail = {
      user: @user,
      role: @role,
      grade: @grade,
      department: @department,
      detail: @detail
    }

    render json: user_detail
  end

  def get_user_detail
    @user = current_api_user
    @role = @user.role.name
    @grade = @user.user_detail.grade.name
    @department = @user.user_detail.department.name
    user_detail = {
      user: @user,
      role: @role,
      grade: @grade,
      department: @department,
      
    }

    render json: user_detail
  end
end
