class PlaceOrdersController < ApplicationController
  before_action :set_place_order, only: [:show, :update, :destroy]

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
    @place_order = PlaceOrder.create(place_order_params)
    render json: fmt(created, @place_order)
  end

  # PATCH/PUT /place_orders/1
  # PATCH/PUT /place_orders/1.json
  def update
    @place_order.update(place_order_params)
    render json: fmt(created, @place_order, "Updated place_order id = "+params[:id])
  end

  # DELETE /place_orders/1
  # DELETE /place_orders/1.json
  def destroy
    @place_order.destroy
    render json:fmt(ok, [], "Deletd place_order = "+params[:id])
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_place_order
      if PlaceOrder.exists?(params[:id])
        @place_order = PlaceOrder.find(params[:id])
      else
        render json: fmt(not_found, [], "Not found place_order = "+params[:id])
      end
    end

    # Only allow a list of trusted parameters through.
    def place_order_params
      params.permit(:group_id, :first, :second, :third, :remark)
    end
end
