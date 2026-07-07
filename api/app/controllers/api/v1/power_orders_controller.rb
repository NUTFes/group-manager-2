# frozen_string_literal: true

class Api::V1::PowerOrdersController < ApplicationController
  before_action :authenticate_api_user!
  before_action :require_admin!

  def update
    power_order = PowerOrder.find_by(id: params[:id])
    return render json: fmt(not_found, [], "Not found power_order = #{params[:id]}"), status: :not_found if power_order.nil?

    if power_order.update(power_order_params)
      render json: fmt(ok, power_order, "Updated power_order id = #{params[:id]}")
    else
      render json: fmt(unprocessable_entity, [], power_order.errors.full_messages.join(', ')), status: :unprocessable_entity
    end
  end

  private

  def power_order_params
    params.permit(:group_id, :item, :power, :manufacturer, :model, :item_url)
  end
end
