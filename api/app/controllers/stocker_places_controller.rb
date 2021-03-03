class StockerPlacesController < ApplicationController
  before_action :set_stocker_place, only: [:show, :update, :destroy]

  def index
    @stocker_places = StockerPlace.all
    render json: @stocker_places
  end

  def show
    render json: @stocker_place
  end

  def create
    @stocker_place = StockerPlace.new(stocker_place_params)
    @stocker_place.save
  end

  def update
    @stocker_place.update(stocker_place_params)
    render json: @stocker_place
  end

  def destroy
    @stocker_place.destroy
    @stocker_places = StockerPlace.all
    render json: @stocker_places
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_stocker_place
      @stocker_place = StockerPlace.find(params[:id])
    end

    # Only allow a list of trusted parameters through.
    def stocker_place_params
      params.permit(:name, :stock_item_status, :assign_item_status)
    end
end
