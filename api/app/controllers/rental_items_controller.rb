class RentalItemsController < ApplicationController
  before_action :set_rental_item, only: [:show, :update, :destroy]

  def index
    @rental_items = RentalItem.all
    render json: @rental_items
  end

  def show
    render json: @rental_item
  end

  def create
    @rental_item = RentalItem.new(rental_item_params)
    @rental_item.save
    render json: @rental_item
  end

  def update
    @rental_item.update(rental_item_params)
    render json: @rental_item
  end

  def destroy
    @rental_item.destroy
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_rental_item
      @rental_item = RentalItem.find(params[:id])
    end

    # Only allow a list of trusted parameters through.
    def rental_item_params
      params.permit(:name, :is_rentable)
    end
end
