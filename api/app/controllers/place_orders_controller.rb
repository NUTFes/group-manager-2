# frozen_string_literal: true

class PlaceOrdersController < ApplicationController
  before_action :set_place_order, only: %i[show update destroy]
  before_action :set_place_order_by_group_id, only: [:get_by_group_id]

  # GET /place_orders
  # GET /place_orders.json
  def index
    @place_orders = participant_scope(PlaceOrder)
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
    group = current_api_user_group!(place_order_params[:group_id])
    return unless group

    @place_order = PlaceOrder.new(place_order_params.merge(group_id: group.id))
    if @place_order.save
      render json: fmt(created, @place_order)
    else
      render_validation_errors(@place_order)
    end
  end

  # PATCH/PUT /place_orders/1
  # PATCH/PUT /place_orders/1.json
  def update
    attrs = place_order_params
    return if attrs[:group_id].present? && !current_api_user_group!(attrs[:group_id])

    if @place_order.update(attrs)
      render json: fmt(ok, @place_order, "Updated place_order id = #{params[:id]}")
    else
      render_validation_errors(@place_order)
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
    @place_order = participant_record!(PlaceOrder, params[:id])
  end

  # Use callbacks to share common setup or constraints between actions.
  def set_place_order_by_group_id
    group = current_api_user_group!(params[:group_id])
    return unless group

    @place_order = PlaceOrder.find_by(group_id: group.id)
    render json: fmt(not_found, [], 'Not Found'), status: :not_found unless @place_order
  end

  # Only allow a list of trusted parameters through.
  def place_order_params
    params.permit(:group_id, :first, :second, :third, :remark)
  end
end
