class PlaceNumberController < ApplicationController
  before_action :set_place_number, only: [:show, :update, :destroy]

  # 会場割り当て

  def index
    @places = Place.all
    @place_numbers = @places.map{
      |place|
      {
        "place": place,
        "place_numbers": place.place_numbers.nil? ? nil : place.place_numbers.map{
          |place_number|
          {
            "group_identification_id": place_number.group_identification.nil? ? nil : place_number.group_identification.id,
            "place_number": place_number.nil? ? nil : place_number,
            "num": place_number.group_identification.nil? ? nil : place_number.group_identification.number,
            "group": place_number.group_identification.nil? ? nil : place_number.group_identification.group
          }
        }
      }
    }
    render json: fmt(ok, @place_numbers)
  end

  def create
    @place_number = PlaceNumber.create(place_number_params)
    render json: fmt(created, @place_number)
  end

  def update
    @place_number.update(place_number_params)
    render json: fmt(ok, @place_number, "Updated place_number id ="+params[:id])
  end

  def destroy
    @place_number.destroy
    render json: fmt(ok, [], "Deleted place_number id ="+params[:id])
  end

  private

  def set_place_number
    if PlaceNumber.exists?(params[:id])
      @place_number = PlaceNumber.find(params[:id])
    else
      render json: fmt(not_found, [], "Not found place_number id = "+params[:id])
    end
  end

  def place_number_params
    params.permit(:place_id, :group_identification_id)
  end
end