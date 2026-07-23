# frozen_string_literal: true

class RentalOrdersController < ApplicationController
  before_action :set_rental_order, only: %i[show update destroy]
  before_action :set_rental_orders_by_group_id, only: [:get_by_group_id]

  # GET /rental_orders
  # GET /rental_orders.json
  def index
    @rental_orders = participant_scope(RentalOrder)
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
    group = current_api_user_group!(rental_order_params[:group_id])
    return unless group

    @rental_order = RentalOrder.create(rental_order_params.merge(group_id: group.id))
    render json: fmt(created, @rental_order)
  end

  # PATCH/PUT /rental_orders/1
  # PATCH/PUT /rental_orders/1.json
  def update
    attrs = rental_order_params
    return if attrs[:group_id].present? && !current_api_user_group!(attrs[:group_id])

    @rental_order.update(attrs)
    render json: fmt(created, @rental_order, "Updated rental_order id = #{params[:id]}")
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
    @rental_order = participant_record!(RentalOrder, params[:id])
  end

  # Use callbacks to share common setup or constraints between actions.
  def set_rental_orders_by_group_id
    group = current_api_user_group!(params[:group_id])
    return unless group

    @rental_orders = RentalOrder.where(group_id: group.id)
  end

  # Only allow a list of trusted parameters through.
  def rental_order_params
    params.permit(:group_id, :rental_item_id, :num)
  end
end
