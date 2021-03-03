class RentalOrdersController < ApplicationController
  before_action :set_rental_order, only: [:show, :update, :destroy]

  # GET /rental_orders
  # GET /rental_orders.json
  def index
    @rental_orders = RentalOrder.all
    render json: @rental_orders
  end

  # GET /rental_orders/1
  # GET /rental_orders/1.json
  def show
    render json: @rental_order
  end

  # POST /rental_orders
  # POST /rental_orders.json
  def create
    @rental_order = RentalOrder.new(rental_order_params)
    @rental_order.save
    render json: @rental_order
  end

  # PATCH/PUT /rental_orders/1
  # PATCH/PUT /rental_orders/1.json
  def update
    @rental_order.update(rental_order_params)
    render json: @rental_order
  end

  # DELETE /rental_orders/1
  # DELETE /rental_orders/1.json
  def destroy
    @rental_order.destroy
    @rental_orders = RentalOrder.all
    render json: @rental_orders
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_rental_order
      @rental_order = RentalOrder.find(params[:id])
    end

    # Only allow a list of trusted parameters through.
    def rental_order_params
      params.permit(:group_id, :rental_item_id, :num)
    end
end
