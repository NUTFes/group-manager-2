class PlaceOrdersController < ApplicationController
  before_action :set_place_order, only: [:show, :update, :destroy]

  # GET /place_orders
  # GET /place_orders.json
  def index
    @place_orders = PlaceOrder.all
    render json: @place_orders
  end

  # GET /place_orders/1
  # GET /place_orders/1.json
  def show
    render json: @place_order
  end

  # POST /place_orders
  # POST /place_orders.json
  def create
    @place_order = PlaceOrder.new(place_order_params)

    if @place_order.save
      render :show, status: :created, location: @place_order
    else
      render json: @place_order.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /place_orders/1
  # PATCH/PUT /place_orders/1.json
  def update
    if @place_order.update(place_order_params)
      render :show, status: :ok, location: @place_order
    else
      render json: @place_order.errors, status: :unprocessable_entity
    end
  end

  # DELETE /place_orders/1
  # DELETE /place_orders/1.json
  def destroy
    @place_order.destroy
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_place_order
      @place_order = PlaceOrder.find(params[:id])
    end

    # Only allow a list of trusted parameters through.
    def place_order_params
      # params.require(:place_order).permit(:group_id, :first, :second, :third, :remark)
      params.permit(:group_id, :first, :second, :third, :remark)
    end
end
