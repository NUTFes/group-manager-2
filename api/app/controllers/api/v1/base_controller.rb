# frozen_string_literal: true

class Api::V1::BaseController < ApplicationController
  before_action :authenticate_api_user!
  before_action :require_staff_or_above!

  private

  def require_staff_or_above!
    return if current_api_user&.role_id.in?([1, 2])

    render json: fmt({ code: 403, message: 'Forbidden' }),
           status: :forbidden
  end
end
