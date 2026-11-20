# frozen_string_literal: true

class RentalOrdersController < ApplicationController
  before_action :set_rental_order, only: %i[show update destroy]
  before_action :set_rental_orders_by_group_id, only: [:get_by_group_id]

  # GET /rental_orders
  # GET /rental_orders.json
  def index
    @rental_orders = RentalOrder.all
    render json: fmt(ok, @rental_orders)
  end

  # GET /rental_orders/1
  # GET /rental_orders/1.json
  def show
    render json: fmt(ok, @rental_order)
  end

  # POST /rental_orders
  # POST /rental_orders.json
  def create
    @rental_order = RentalOrder.new(rental_order_params)
    if @rental_order.save
      render json: fmt(created, @rental_order)
    else
      render_validation_errors(@rental_order)
    end
  end

  # PATCH/PUT /rental_orders/1
  # PATCH/PUT /rental_orders/1.json
  def update
    if @rental_order.update(rental_order_params)
      render json: fmt(created, @rental_order, "Updated rental_order id = #{params[:id]}")
    else
      render_validation_errors(@rental_order)
    end
  end

  # DELETE /rental_orders/1
  # DELETE /rental_orders/1.json
  def destroy
    @rental_order.destroy
    render json: fmt(ok, [], "Deleted rental_order = #{params[:id]}")
  end

  # GET /rental_orders/group_id/1
  def get_by_group_id
    render json: fmt(ok, @rental_orders)
  end

  private

  # Use callbacks to share common setup or constraints between actions.
  def set_rental_order
    if RentalOrder.exists?(params[:id])
      @rental_order = RentalOrder.find(params[:id])
    else
      render json: fmt(not_found, [], "Not found rental_order = #{params[:id]}")
    end
  end

  # Use callbacks to share common setup or constraints between actions.
  def set_rental_orders_by_group_id
    if RentalOrder.exists?(group_id: params[:group_id])
      @rental_orders = RentalOrder.where(group_id: params[:group_id])
    else
      render json: fmt(not_found, [], "Not found rental_order = #{params[:group_id]}")
    end
  end

  # Only allow a list of trusted parameters through.
  def rental_order_params
    params.permit(:group_id, :rental_item_id, :num)
  end
end
