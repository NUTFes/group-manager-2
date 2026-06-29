# frozen_string_literal: true

class FireEquipmentOrdersController < ApplicationController
  before_action :set_fire_equipment_order, only: %i[show update destroy]

  # GET /fire_equipment_orders
  def index
    fes_year_id = params[:fes_year_id]
    @fire_equipment_orders = if fes_year_id.present? && fes_year_id.to_i != 0
                               FireEquipmentOrder.joins(:group).where(groups: { fes_year_id: fes_year_id })
                             else
                               FireEquipmentOrder.includes(:group).all
                             end
    orders_with_fuel_japanese = @fire_equipment_orders.map do |order|
      order.as_json(include: { group: { only: %i[id name] } }).merge(
        fuel_japanese: order.fuel_japanese
      )
    end
    render json: fmt(ok, orders_with_fuel_japanese)
  end

  # GET /fire_equipment_orders/:id
  def show
    order_with_fuel_japanese = @fire_equipment_order.as_json(include: { group: { only: %i[id name] } }).merge(
      fuel_japanese: @fire_equipment_order.fuel_japanese
    )
    render json: fmt(ok, order_with_fuel_japanese)
  end

  # POST /fire_equipment_orders
  def create
    @fire_equipment_order = FireEquipmentOrder.new(fire_equipment_order_params)

    if @fire_equipment_order.save
      render json: fmt(created, @fire_equipment_order)
    else
      render json: fmt(bad_request, @fire_equipment_order.errors)
    end
  end

  # PATCH/PUT /fire_equipment_orders/:id
  def update
    if @fire_equipment_order.update(fire_equipment_order_params)
      render json: fmt(created, @fire_equipment_order)
    else
      render json: fmt(bad_request, @fire_equipment_order.errors)
    end
  end

  # DELETE /fire_equipment_orders/:id
  def destroy
    @fire_equipment_order.destroy
  end

  # GET /fire_equipment_orders/group/:group_id
  def get_by_group_id
    orders = FireEquipmentOrder.where(group_id: params[:group_id])
    render json: fmt(ok, orders)
  end

  private

  def set_fire_equipment_order
    if FireEquipmentOrder.exists?(params[:id])
      @fire_equipment_order = FireEquipmentOrder.find(params[:id])
    else
      render json: fmt(not_found, [], "Not found fire_equipment_order = #{params[:id]}")
    end
  end

  def fire_equipment_order_params
    params.require(:fire_equipment_order).permit(:name, :quantity, :fuel, :usage, :is_takeaway, :remark, :group_id)
  end
end