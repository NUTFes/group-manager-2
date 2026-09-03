# frozen_string_literal: true

class Api::V1::PowerOrdersController < ApplicationController
  before_action :authenticate_api_user!
  before_action :require_admin!

  def create
    power_order = PowerOrder.new(power_order_params)

    if power_order.save
      render json: fmt(created, power_order)
    else
      render_validation_errors(power_order)
    end
  end

  def update
    power_order = PowerOrder.find_by(id: params[:id])
    return render json: fmt(not_found, [], "Not found power_order = #{params[:id]}"), status: :not_found if power_order.nil?

    if power_order.update(power_order_params)
      render json: fmt(ok, power_order, "Updated power_order id = #{params[:id]}")
    else
      render_validation_errors(power_order)
    end
  end

  def destroy
    power_order = PowerOrder.find_by(id: params[:id])
    return render json: fmt(not_found, [], "Not found power_order = #{params[:id]}"), status: :not_found if power_order.nil?

    power_order.destroy
    render json: fmt(ok, [], "Deleted power_order = #{params[:id]}")
  end

  private

  def power_order_params
    params.permit(:group_id, :item, :power, :manufacturer, :model, :item_url)
  end
end
