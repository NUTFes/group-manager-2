# frozen_string_literal: true

class Api::V1::FireEquipmentOrdersController < Api::V1::StaffController
  def index
    fes_year_id = params[:fes_year_id]
    fire_equipment_orders =
      if fes_year_id.present? && fes_year_id.to_i != 0
        FireEquipmentOrder.joins(:group).where(groups: { fes_year_id: fes_year_id })
      else
        FireEquipmentOrder.includes(:group).all
      end

    render json: fmt(ok, fire_equipment_orders.map { |order| order_for_admin(order) })
  end

  def show
    fire_equipment_order = FireEquipmentOrder.find_by(id: params[:id])
    return render json: fmt(not_found, [], "Not found fire_equipment_order = #{params[:id]}"), status: :not_found if fire_equipment_order.nil?

    render json: fmt(ok, order_for_admin(fire_equipment_order))
  end

  def create
    fire_equipment_order = FireEquipmentOrder.new(fire_equipment_order_params)

    if fire_equipment_order.save
      render json: fmt(created, fire_equipment_order)
    else
      render json: fmt(unprocessable_entity, [], fire_equipment_order.errors.full_messages.join(', ')), status: :unprocessable_entity
    end
  end

  def update
    fire_equipment_order = FireEquipmentOrder.find_by(id: params[:id])
    return render json: fmt(not_found, [], "Not found fire_equipment_order = #{params[:id]}"), status: :not_found if fire_equipment_order.nil?

    if fire_equipment_order.update(fire_equipment_order_params)
      render json: fmt(ok, fire_equipment_order)
    else
      render json: fmt(unprocessable_entity, [], fire_equipment_order.errors.full_messages.join(', ')), status: :unprocessable_entity
    end
  end

  def destroy
    fire_equipment_order = FireEquipmentOrder.find_by(id: params[:id])
    return render json: fmt(not_found, [], "Not found fire_equipment_order = #{params[:id]}"), status: :not_found if fire_equipment_order.nil?

    fire_equipment_order.destroy
    render json: fmt(ok, [], "Deleted fire_equipment_order = #{params[:id]}")
  end

  private

  def fire_equipment_order_params
    source = params[:fire_equipment_order].presence || params
    source.permit(:group_id, :name, :quantity, :fuel, :usage, :is_takeaway, :remark)
  end

  def order_for_admin(order)
    order.as_json(include: { group: { only: %i[id name] } }).merge(
      fuel_japanese: order.fuel_japanese
    )
  end
end
