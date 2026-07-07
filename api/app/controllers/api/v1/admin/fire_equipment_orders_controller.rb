# frozen_string_literal: true

class Api::V1::Admin::FireEquipmentOrdersController < ApplicationController
  before_action :authenticate_api_user!

  def update
    fire_equipment_order = FireEquipmentOrder.find_by(id: params[:id])
    return render json: fmt(not_found, [], "Not found fire_equipment_order = #{params[:id]}"), status: :not_found if fire_equipment_order.nil?

    if fire_equipment_order.update(fire_equipment_order_params)
      render json: fmt(ok, fire_equipment_order)
    else
      render json: fmt(unprocessable_entity, [], fire_equipment_order.errors.full_messages.join(', ')), status: :unprocessable_entity
    end
  end

  private

  def fire_equipment_order_params
    source = params[:fire_equipment_order].presence || params
    source.permit(:group_id, :name, :quantity, :fuel, :usage, :is_takeaway, :remark)
  end
end
