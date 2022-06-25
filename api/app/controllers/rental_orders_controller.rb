class RentalOrdersController < ApplicationController
  before_action :set_rental_order, only: [:show, :update, :destroy]

  # GET /rental_orders
  # GET /rental_orders.json
  def index
    @rental_orders = RentalOrder.all
    render json: fmt(ok, @rental_orders)
  end

  # GET /rental_orders/1
  # GET /rental_orders/1.json
  def show
    render json: fmt(ok, @rental_order)
  end

  # POST /rental_orders
  # POST /rental_orders.json
  def create
    @rental_order = RentalOrder.create(rental_order_params)
    render json: fmt(created, @rental_order)
  end

  # PATCH/PUT /rental_orders/1
  # PATCH/PUT /rental_orders/1.json
  def update
    @rental_order.update(rental_order_params)
    render json: fmt(created, @rental_order, "Updated rental_order id = "+params[:id])
  end

  # DELETE /rental_orders/1
  # DELETE /rental_orders/1.json
  def destroy
    @rental_order.destroy
    render json: fmt(ok, [], "Deleted rental_order = "+params[:id]) 
  end

  def index_with_unassigned_num
    @rental_orders = RentalOrder.all
    if(@rental_orders.length != 0)
      @rental_orders.each do |rental_order|
        unassigned_num = rental_order.num - AssignRentalItem.where(group_id: rental_order.group_id, rental_item_id: rental_order.rental_item_id).sum(:num)
        temp = {
          id: rental_order.id,
          group_name: rental_order.group.name,
          rental_item: rental_order.rental_item.name,
          num: rental_order.num,
          unassigned_num: unassigned_num,
        }
        output << temp
      end
      render json: fmt(ok, output)
    else
      render json: fmt(not_found, [], "Not found stocker_items")
    end
  end

  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_rental_order
      if RentalOrder.exists?(params[:id])
        @rental_order = RentalOrder.find(params[:id])
      else
        render json: fmt(not_found, [], "Not found rental_order = "+params[:id])
      end
    end

    # Only allow a list of trusted parameters through.
    def rental_order_params
      params.permit(:group_id, :rental_item_id, :num)
    end
end
