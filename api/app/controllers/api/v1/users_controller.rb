class Api::V1::UsersController < ApplicationController
  before_action :authenticate_api_user!
  def index
    @users = User.all
    render json: { status: 'SUCCESS', message: 'Loaded users', data: @users }
  end
  
  def show
    @sign_in = api_user_signed_in?
    @user = current_api_user
    render json: { data: @user}
  end
end
