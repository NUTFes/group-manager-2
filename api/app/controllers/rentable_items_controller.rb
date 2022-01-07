class RentableItemsController < ApplicationController
  before_action :set_rentable_item, only: [:show, :update, :destroy]

  # GET /rentable_items
  # GET /rentable_items.json
  def index
    @rentable_items = RentableItem.all
    render json: fmt(ok, @rentable_items)
  end

  # GET /rentable_items/1
  # GET /rentable_items/1.json
  def show
    render json: fmt(ok, @rentable_item)
  end

  # POST /rentable_items
  # POST /rentable_items.json
  def create
    @rentable_item = RentableItem.create(rentable_item_params)
    render json: fmt(created, @rentable_item)
  end

  # PATCH/PUT /rentable_items/1
  # PATCH/PUT /rentable_items/1.json
  def update
    @rentable_item.update(rentable_item_params)
    render json: fmt(created, @rentable_item, "Updated rentable_item id = "+params[:id])
  end

  # DELETE /rentable_items/1
  # DELETE /rentable_items/1.json
  def destroy
    @rentable_item.destroy
    render json: fmt(ok, [], "Deleted rentable_item = "+params[:id])
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_rentable_item
      if RentableItem.exists?(params[:id])
        @rentable_item = RentableItem.find(params[:id])
      else
        render json: fmt(not_found, [], "Not found rentable_item = "+params[:id])
      end
    end

    # Only allow a list of trusted parameters through.
    def rentable_item_params
      params.permit(:stocker_item_id, :stocker_place_id, :max_num)
    end
end
