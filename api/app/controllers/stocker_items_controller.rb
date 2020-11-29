class StockerItemsController < ApplicationController
  before_action :set_stocker_item, only: [:show, :update, :destroy]

  # GET /stocker_items
  # GET /stocker_items.json
  def index
    @stocker_items = StockerItem.all
  end

  # GET /stocker_items/1
  # GET /stocker_items/1.json
  def show
  end

  # POST /stocker_items
  # POST /stocker_items.json
  def create
    @stocker_item = StockerItem.new(stocker_item_params)

    if @stocker_item.save
      render :show, status: :created, location: @stocker_item
    else
      render json: @stocker_item.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /stocker_items/1
  # PATCH/PUT /stocker_items/1.json
  def update
    if @stocker_item.update(stocker_item_params)
      render :show, status: :ok, location: @stocker_item
    else
      render json: @stocker_item.errors, status: :unprocessable_entity
    end
  end

  # DELETE /stocker_items/1
  # DELETE /stocker_items/1.json
  def destroy
    @stocker_item.destroy
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_stocker_item
      @stocker_item = StockerItem.find(params[:id])
    end

    # Only allow a list of trusted parameters through.
    def stocker_item_params
      params.require(:stocker_item).permit(:rental_item_id, :stocker_place_id, :fes_year_id, :num)
    end
end
