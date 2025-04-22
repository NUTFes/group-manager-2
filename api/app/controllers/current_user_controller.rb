# app/controllers/current_user_controller.rb
class CurrentUserController < ApplicationController
  # JWT が有効なリクエストのみ許可
  before_action :authenticate_user!

  def index
    # current_user をそのまま JSON で返す
    render json: current_user, status: :ok
  end
end
