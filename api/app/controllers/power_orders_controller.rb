class PowerOrdersController < ApplicationController
  before_action :set_power_order, only: [:show, :update, :destroy]

  # GET /power_orders
  # GET /power_orders.json
  def index
    @power_orders = PowerOrder.all
    render json: fmt(ok, @power_orders)
  end

  # GET /power_orders/1
  # GET /power_orders/1.json
  def show
    render json: fmt(ok, @power_order)
  end

  # POST /power_orders
  # POST /power_orders.json
  def create
    @power_order = PowerOrder.create(power_order_params)
    render json: fmt(created, @power_order)
  end

  # PATCH/PUT /power_orders/1
  # PATCH/PUT /power_orders/1.json
  def update
    @power_order.update(power_order_params)
    render json: fmt(created, @power_order, "Updated power_order id = "+params[:id])
  end

  # DELETE /power_orders/1
  # DELETE /power_orders/1.json
  def destroy
    @power_order.destroy
    render json: fmt(ok, [], "Deleted power_order = "+params[:id])
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_power_order
      if PowerOrder.exists?(params[:id])
        @power_order = PowerOrder.find(params[:id])
      else
        render json: fmt(not_found, [], "Not found power_order = "+params[:id])
      end
    end

    # Only allow a list of trusted parameters through.
    def power_order_params
      params.permit(:group_id, :item, :power, :manufacturer, :model, :item_url)
    end
end
