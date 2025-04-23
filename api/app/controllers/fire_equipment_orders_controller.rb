class FireEquipmentOrdersController < ApplicationController
  before_action :authenticate_api_user!
  before_action :set_fire_equipment_order, only: [:show, :update, :destroy]
  before_action :set_fire_equipment_order_by_group_id, only: [:get_by_group_id]

  # GET /fire_equipment_orders
  def index
    @fire_equipment_orders = FireEquipmentOrder.all
    render json: fmt(ok, @fire_equipment_orders)
  end

  # GET /fire_equipment_orders/:id
  def show
    render json: fmt(ok, @fire_equipment_order)
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
    if @fire_equipment_order
      render json: fmt(ok, @fire_equipment_order)
    else
      render json: fmt(not_found, [], "Not found fire_equipment_order = "+params[:group_id])
    end
  end

  private

  def set_fire_equipment_order
    if FireEquipmentOrder.exists?(params[:id])
      @fire_equipment_order = FireEquipmentOrder.find(params[:id])
    else
      render json: fmt(not_found, [], "Not found fire_equipment_order = "+params[:id])
    end
  end

  def set_fire_equipment_order_by_group_id
    if FireEquipmentOrder.exists?(group_id: params[:group_id])
      @fire_equipment_order = FireEquipmentOrder.find_by(group_id: params[:group_id])
    else
      render json: fmt(not_found, [], "Not found fire_equipment_order = "+params[:group_id])
    end
  end

  def fire_equipment_order_params
    params.require(:fire_equipment_order).permit(:name, :quantity, :fuel, :usage, :is_takeaway, :remark, :group_id)
  end
end
