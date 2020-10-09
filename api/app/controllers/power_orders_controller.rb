class PowerOrdersController < ApplicationController
  before_action :set_power_order, only: [:show, :update, :destroy]

  # GET /power_orders
  # GET /power_orders.json
  def index
    @power_orders = PowerOrder.all
  end

  # GET /power_orders/1
  # GET /power_orders/1.json
  def show
  end

  # POST /power_orders
  # POST /power_orders.json
  def create
    @power_order = PowerOrder.new(power_order_params)

    if @power_order.save
      render :show, status: :created, location: @power_order
    else
      render json: @power_order.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /power_orders/1
  # PATCH/PUT /power_orders/1.json
  def update
    if @power_order.update(power_order_params)
      render :show, status: :ok, location: @power_order
    else
      render json: @power_order.errors, status: :unprocessable_entity
    end
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
      params.require(:power_order).permit(:group_id, :item, :power, :manufacture, :model)
    end
end
