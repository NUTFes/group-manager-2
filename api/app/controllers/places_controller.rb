class PlacesController < ApplicationController
  before_action :set_place, only: [:show, :update, :destroy]

  def index
    @places = Place.all
    render json: fmt(ok, @places)
  end

  def show
    render json: fmt(ok, @place)
  end

  def create
    @place = Place.new(place_params)
    @place.save
    render json: fmt(ok, @place)
  end

  def update
    @place.update(place_params)
    render json: fmt(ok, @place)
  end

  # DELETE /place_orders/1
  # DELETE /place_orders/1.json
  def destroy
    @place.destroy
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_place
      @place = Place.find(params[:id])
    end

    # Only allow a list of trusted parameters through.
    def place_params
      params.permit(:name)
    end
end
