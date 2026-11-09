# frozen_string_literal: true

class StageOrdersController < ApplicationController
  before_action :set_stage_order, only: %i[show update destroy]
  before_action :set_stage_order_by_group_id, only: [:get_by_group_id]

  # GET /stage_orders
  # GET /stage_orders.json
  def index
    @stage_orders = StageOrder.all
    render json: fmt(ok, @stage_orders)
  end

  # GET /stage_orders/1
  # GET /stage_orders/1.json
  def show
    render json: fmt(ok, @stage_order)
  end

  # POST /stage_orders
  # POST /stage_orders.json
  def create
    @stage_order = StageOrder.new(stage_order_params)
    if @stage_order.save
      render json: fmt(created, @stage_order)
    else
      render_validation_errors(@stage_order)
    end
  end

  # PATCH/PUT /stage_orders/1
  # PATCH/PUT /stage_orders/1.json
  def update
    if @stage_order.update(stage_order_params)
      render json: fmt(created, @stage_order, "Updated stage_order id = #{params[:id]}")
    else
      render_validation_errors(@stage_order)
    end
  end

  # DELETE /stage_orders/1
  # DELETE /stage_orders/1.json
  def destroy
    @stage_order.destroy
    render json: fmt(ok, [], "Deleted stage_order = #{params[:id]}")
  end

  # GET /stage_orders/group_id/1
  def get_by_group_id
    render json: fmt(ok, @stage_order)
  end

  private

  # Use callbacks to share common setup or constraints between actions.
  def set_stage_order
    if StageOrder.exists?(params[:id])
      @stage_order = StageOrder.find(params[:id])
    else
      render json: fmt(not_found, [], "Not found stage_order = #{params[:id]}")
    end
  end

  # Use callbacks to share common setup or constraints between actions.
  def set_stage_order_by_group_id
    if StageOrder.exists?(group_id: params[:group_id])
      @stage_order = StageOrder.find_by(group_id: params[:group_id])
    else
      render json: fmt(not_found, [], "Not found stage_order = #{params[:group_id]}")
    end
  end

  # Only allow a list of trusted parameters through.
  def stage_order_params
    params.permit(:group_id, :is_sunny, :fes_date_id, :stage_first, :stage_second, :use_time_interval, :prepare_time_interval, :cleanup_time_interval, :prepare_start_time, :performance_start_time, :performance_end_time, :cleanup_end_time)
  end
end
