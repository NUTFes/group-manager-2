class RentalOrdersController < ApplicationController
  before_action :set_rental_order, only: [:show, :update, :destroy]

  # GET /rental_orders
  # GET /rental_orders.json
  def index
    @rental_orders = RentalOrder.all
  end

  # GET /rental_orders/1
  # GET /rental_orders/1.json
  def show
  end

  # POST /rental_orders
  # POST /rental_orders.json
  def create
    @rental_order = RentalOrder.new(rental_order_params)

    if @rental_order.save
      render :show, status: :created, location: @rental_order
    else
      render json: @rental_order.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /rental_orders/1
  # PATCH/PUT /rental_orders/1.json
  def update
    if @rental_order.update(rental_order_params)
      render :show, status: :ok, location: @rental_order
    else
      render json: @rental_order.errors, status: :unprocessable_entity
    end
  end

  # DELETE /rental_orders/1
  # DELETE /rental_orders/1.json
  def destroy
    @rental_order.destroy
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_rental_order
      @rental_order = RentalOrder.find(params[:id])
    end

    # Only allow a list of trusted parameters through.
    def rental_order_params
      params.require(:rental_order).permit(:group_id, :rental_item_id, :num)
    end
end
