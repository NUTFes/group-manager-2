class StageOrdersController < ApplicationController
  before_action :set_stage_order, only: [:show, :update, :destroy]

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
    @stage_order = StageOrder.create(stage_order_params)
    render json: fmt(created, @stage_order) 
  end

  # PATCH/PUT /stage_orders/1
  # PATCH/PUT /stage_orders/1.json
  def update
    @stage_order.update(stage_order_params)
    render json: fmt(created, @stage_order, "Updated stage_order id = "+params[:id]) 
  end

  # DELETE /stage_orders/1
  # DELETE /stage_orders/1.json
  def destroy
    @stage_order.destroy
    render json: fmt(ok, [], "Deleted stage_order = "+params[:id])  
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_stage_order
      if StageOrder.exists?(params[:id])
        @stage_order = StageOrder.find(params[:id])
      else
        render json: fmt(not_found, [], "Not found stage_order = "+params[:id])
      end
    end

    # Only allow a list of trusted parameters through.
    def stage_order_params
      params.permit(:group_id, :is_sunny, :fes_date_id, :stage_first, :stage_second, :use_time_interval, :prepare_time_interval, :cleanup_time_interval, :prepare_start_time, :performance_start_time, :performance_end_time, :cleanup_end_time)
    end
end
