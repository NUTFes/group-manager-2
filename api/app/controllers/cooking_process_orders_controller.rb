class CookingProcessOrdersController < ApplicationController
  before_action :set_cooking_process_order, only: [:show, :update, :destroy]

  # GET /cooking_process_orders
  def index
    @cooking_process_orders = CookingProcessOrder.all
    render json: @cooking_process_orders
  end

  # GET /cooking_process_orders/1
  def show
    render json: @cooking_process_order
  end

  # POST /cooking_process_orders
  def create
    @cooking_process_order = CookingProcessOrder.new(cooking_process_order_params)
    @cooking_process_order.group_id = params[:group_id]
    if @cooking_process_order.save
      render json: fmt(created, @cooking_process_order)
    else
      render json: fmt(error, @cooking_process_order)
    end
  end

  # PATCH/PUT /cooking_process_orders/1
  def update
    @cooking_process_order.update(cooking_process_order_params)
    render json: fmt(created, @cooking_process_order, "Updated cooking process order id = " + params[:id])
  end

  # DELETE /cooking_process_orders/1
  def destroy
    @cooking_process_order.destroy
    render json: fmt(ok, [], "Deleted cooking process order id = " + params[:id])
  end

  private
    # Use callbacks to share common setup or constraints between actions
    def set_cooking_process_order
      @cooking_process_order = CookingProcessOrder.find(params[:id])
    rescue ActiveRecord::RecordNotFound
      render json: { error: "Not found" }, status: :not_found
    end

    # Only allow a list of trusted parameters through
    def cooking_process_order_params
      params.require(:cooking_process_order).permit(:pre_open_kitchen, :during_open_kitchen, :tent)
    end
end
