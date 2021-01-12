class PowerOrdersController < ApplicationController
  before_action :set_power_order, only: [:show, :update, :destroy]

  # GET /power_orders
  # GET /power_orders.json
  def index
    @power_orders = PowerOrder.all
    render json: @power_orders
  end

  # GET /power_orders/1
  # GET /power_orders/1.json
  def show
    render json: @power_order
  end

  # POST /power_orders
  # POST /power_orders.json
  def create
    @power_order = PowerOrder.new(power_order_params)
    @power_order.save
    render json: @power_order
  end

  # PATCH/PUT /power_orders/1
  # PATCH/PUT /power_orders/1.json
  def update
    @power_order.update(power_order_params)
    render json: @power_order
  end

  # DELETE /power_orders/1
  # DELETE /power_orders/1.json
  def destroy
    @power_order.destroy
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_power_order
      @power_order = PowerOrder.find(params[:id])
    end

    # Only allow a list of trusted parameters through.
    def power_order_params
      params.permit(:group_id, :item, :power, :manufacturer, :model, :item_url)
    end
end
