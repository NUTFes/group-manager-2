class RentableItemsController < ApplicationController
  before_action :set_rentable_item, only: [:show, :update, :destroy]

  # GET /rentable_items
  # GET /rentable_items.json
  def index
    @rentable_items = RentableItem.all
    render json: @rentable_items
  end

  # GET /rentable_items/1
  # GET /rentable_items/1.json
  def show
    render json: @rentable_item
  end

  # POST /rentable_items
  # POST /rentable_items.json
  def create
    @rentable_item = RentableItem.new(rentable_item_params)
    @rentable_item.save
  end

  # PATCH/PUT /rentable_items/1
  # PATCH/PUT /rentable_items/1.json
  def update
    @rentable_item.update(rentable_item_params)
  end

  # DELETE /rentable_items/1
  # DELETE /rentable_items/1.json
  def destroy
    @rentable_item.destroy
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_rentable_item
      @rentable_item = RentableItem.find(params[:id])
    end

    # Only allow a list of trusted parameters through.
    def rentable_item_params
      params.permit(:stocker_item_id, :stocker_place_id, :max_num)
    end
end
