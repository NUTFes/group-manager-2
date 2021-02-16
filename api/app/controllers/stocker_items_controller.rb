class StockerItemsController < ApplicationController
  before_action :set_stocker_item, only: [:show, :update, :destroy]

  # GET /stocker_items
  # GET /stocker_items.json
  def index
    @stocker_items = StockerItem.all
    render json: @stocker_items
  end

  # GET /stocker_items/1
  # GET /stocker_items/1.json
  def show
    render json: @stocker_item
  end

  # POST /stocker_items
  # POST /stocker_items.json
  def create
    @stocker_item = StockerItem.new(stocker_item_params)
    @stocker_item.save
    # @stocker_items = StockerItem.all
    # render json: @stocker_items
  end

  # PATCH/PUT /stocker_items/1
  # PATCH/PUT /stocker_items/1.json
  def update
    @stocker_item.update(stocker_item_params)
    render json: @stocker_item
  end

  # DELETE /stocker_items/1
  # DELETE /stocker_items/1.json
  def destroy
    @stocker_item.destroy
    @stocker_items = StockerItem.all
    render json: @stocker_items
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_stocker_item
      @stocker_item = StockerItem.find(params[:id])
    end

    # Only allow a list of trusted parameters through.
    def stocker_item_params
      params.permit(:rental_item_id, :stocker_place_id, :fes_year_id, :num)
    end
end
