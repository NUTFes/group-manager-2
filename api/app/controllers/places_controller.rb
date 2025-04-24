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
    @place = Place.create(place_params)
    render json: fmt(created, @place)
  end

  def update
    @place.update(place_params)
    render json: fmt(created, @place, "Updated place id = "+params[:id])
  end

  # DELETE /place_orders/1
  # DELETE /place_orders/1.json
  def destroy
    @place.destroy
    render json: fmt(ok, [], "Deleted place = "+params[:id])
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_place
      if Place.exists?(params[:id])
        @place = Place.find(params[:id])
      else
        render json: fmt(not_found, [], "Not found place = "+params[:id])
      end
    end

    # Only allow a list of trusted parameters through.
    def place_params
      params.permit(:name)
    end
end
