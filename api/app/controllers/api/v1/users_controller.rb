class Api::V1::UsersController < ApplicationController
  # before_action :authenticate_api_user!

  def index

    @users = User.all
    render json: { status: 'SUCCESS', message: 'Loaded users', data: @users }
  end
  
  def show
    @user = current_api_user.id
    render json: { data: @user }
  end
end
