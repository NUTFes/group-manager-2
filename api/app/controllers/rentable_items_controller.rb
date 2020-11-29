class RentableItemsController < ApplicationController
  before_action :set_rentable_item, only: [:show, :update, :destroy]

  # GET /rentable_items
  # GET /rentable_items.json
  def index
    @rentable_items = RentableItem.all
  end

  # GET /rentable_items/1
  # GET /rentable_items/1.json
  def show
  end

  # POST /rentable_items
  # POST /rentable_items.json
  def create
    @rentable_item = RentableItem.new(rentable_item_params)

    if @rentable_item.save
      render :show, status: :created, location: @rentable_item
    else
      render json: @rentable_item.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /rentable_items/1
  # PATCH/PUT /rentable_items/1.json
  def update
    if @rentable_item.update(rentable_item_params)
      render :show, status: :ok, location: @rentable_item
    else
      render json: @rentable_item.errors, status: :unprocessable_entity
    end
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
      params.require(:rentable_item).permit(:stocker_item_id, :stocker_place_id, :max_num)
    end
end
