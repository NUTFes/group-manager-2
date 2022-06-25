class StockerItemsController < ApplicationController
  before_action :set_stocker_item, only: [:show, :update, :destroy]

  # GET /stocker_items
  # GET /stocker_items.json
  def index
    @stocker_items = StockerItem.all
    render json: fmt(ok, @stocker_items)
  end

  # GET /stocker_items/1
  # GET /stocker_items/1.json
  def show
    render json: fmt(ok, @stocker_item)
  end

  # POST /stocker_items
  # POST /stocker_items.json
  def create
    @stocker_item = StockerItem.create(stocker_item_params)
    render json: fmt(created, @stocker_item)
    # @stocker_items = StockerItem.all
    # render json: @stocker_items
  end

  # PATCH/PUT /stocker_items/1
  # PATCH/PUT /stocker_items/1.json
  def update
    @stocker_item.update(stocker_item_params)
    render json: fmt(created, @stocker_item, "Updated stocker_item id = "+params[:id])
  end

  # DELETE /stocker_items/1
  # DELETE /stocker_items/1.json
  def destroy
    @stocker_item.destroy
    render json: fmt(ok, [], "Deleted stocker_item = "+params[:id])
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_stocker_item
      if StockerItem.exists?(params[:id])
        @stocker_item = StockerItem.find(params[:id])
      else
        render json: fmt(not_found, [], "Not found stocker_item = "+params[:id])
      end
    end

    # Only allow a list of trusted parameters through.
    def stocker_item_params
      params.permit(:rental_item_id, :stocker_place_id, :fes_year_id, :num)
    end
end
