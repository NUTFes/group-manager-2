class StageOrdersController < ApplicationController
  before_action :set_stage_order, only: [:show, :update, :destroy]

  # GET /stage_orders
  # GET /stage_orders.json
  def index
    @stage_orders = StageOrder.all
  end

  # GET /stage_orders/1
  # GET /stage_orders/1.json
  def show
  end

  # POST /stage_orders
  # POST /stage_orders.json
  def create
    @stage_order = StageOrder.new(stage_order_params)

    if @stage_order.save
      render :show, status: :created, location: @stage_order
    else
      render json: @stage_order.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /stage_orders/1
  # PATCH/PUT /stage_orders/1.json
  def update
    if @stage_order.update(stage_order_params)
      render :show, status: :ok, location: @stage_order
    else
      render json: @stage_order.errors, status: :unprocessable_entity
    end
  end

  # DELETE /stage_orders/1
  # DELETE /stage_orders/1.json
  def destroy
    @stage_order.destroy
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_stage_order
      @stage_order = StageOrder.find(params[:id])
    end

    # Only allow a list of trusted parameters through.
    def stage_order_params
      params.require(:stage_order).permit(:group_id, :is_sunny, :fes_date_id, :stage_first, :stage_second, :use_time_interval, :prepare_time_interval, :cleanup_time_interval, :prepare_start_time, :performance_start_time, :performance_end_time, :cleanup_end_time)
    end
end
