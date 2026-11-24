# frozen_string_literal: true

class StageOrdersController < ApplicationController
  before_action :authenticate_api_user!
  # userの画面から呼ばれるaction以外は管理画面向け（参照はstaff以上、書き込みはmanager）
  before_action :require_staff!, except: %i[create update get_by_group_id]
  before_action :require_manager!, except: %i[create update get_by_group_id index show]
  # staffは閲覧専用のため、userの画面から呼ばれる書き込みも拒否する
  before_action :reject_staff_write!, only: %i[create update]
  before_action :require_accessible_group_param!, only: %i[create update get_by_group_id]
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
  # 晴天・雨天の申請があるため、団体のステージ申請をすべて返す
  def get_by_group_id
    render json: fmt(ok, @stage_orders)
  end

  private

  # Use callbacks to share common setup or constraints between actions.
  def set_stage_order
    @stage_order = scope_to_accessible_groups(StageOrder.all).find_by(id: params[:id])
    return if @stage_order

    render_not_found_or_forbidden { render json: fmt(not_found, [], "Not found stage_order = #{params[:id]}") }
  end

  # Use callbacks to share common setup or constraints between actions.
  def set_stage_order_by_group_id
    if StageOrder.exists?(group_id: params[:group_id])
      @stage_orders = StageOrder.where(group_id: params[:group_id])
    else
      render json: fmt(not_found, [], "Not found stage_order = #{params[:group_id]}")
    end
  end

  # Only allow a list of trusted parameters through.
  def stage_order_params
    params.permit(:group_id, :is_sunny, :fes_date_id, :stage_first, :stage_second, :use_time_interval, :prepare_time_interval, :cleanup_time_interval, :prepare_start_time, :performance_start_time, :performance_end_time, :cleanup_end_time)
  end
end
