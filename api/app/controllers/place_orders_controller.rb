# frozen_string_literal: true

class PlaceOrdersController < ApplicationController
  before_action :set_place_order, only: %i[show update destroy]
  before_action :set_place_order_by_group_id, only: [:get_by_group_id]

  # GET /place_orders
  # GET /place_orders.json
  def index
    @place_orders = PlaceOrder.all
    render json: fmt(ok, @place_orders)
  end

  # GET /place_orders/1
  # GET /place_orders/1.json
  def show
    render json: fmt(ok, @place_order)
  end

  # POST /place_orders
  # POST /place_orders.json
  def create
    @place_order = PlaceOrder.new(place_order_params)
    if @place_order.save
      render json: fmt(created, @place_order)
    else
      render json: fmt(unprocessable_entity, [], @place_order.errors.full_messages.join(', ')), status: :unprocessable_entity
    end
  end

  # PATCH/PUT /place_orders/1
  # PATCH/PUT /place_orders/1.json
  def update
    if @place_order.update(place_order_params)
      render json: fmt(created, @place_order, "Updated place_order id = #{params[:id]}")
    else
      render json: fmt(unprocessable_entity, [], @place_order.errors.full_messages.join(', ')), status: :unprocessable_entity
    end
  end

  # DELETE /place_orders/1
  # DELETE /place_orders/1.json
  def destroy
    @place_order.destroy
    render json: fmt(ok, [], "Deletd place_order = #{params[:id]}")
  end

  # GET /place_orders/group_id/1
  def get_by_group_id
    render json: fmt(ok, @place_order)
  end

  private

  # Use callbacks to share common setup or constraints between actions.
  def set_place_order
    if PlaceOrder.exists?(params[:id])
      @place_order = PlaceOrder.find(params[:id])
    else
      render json: fmt(not_found, [], "Not found place_order = #{params[:id]}")
    end
  end

  # Use callbacks to share common setup or constraints between actions.
  def set_place_order_by_group_id
    if PlaceOrder.exists?(group_id: params[:group_id])
      @place_order = PlaceOrder.find_by(group_id: params[:group_id])
    else
      render json: fmt(not_found, [], "Not found place_order = #{params[:group_id]}")
    end
  end

  # Only allow a list of trusted parameters through.
  def place_order_params
    params.permit(:group_id, :first, :second, :third, :remark)
  end
end
