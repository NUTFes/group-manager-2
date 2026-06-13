# frozen_string_literal: true

class StockerPlacesController < ApplicationController
  before_action :set_stocker_place, only: %i[show update destroy]

  def index
    @stocker_places = StockerPlace.includes(:place_category).all
    render json: fmt(ok, @stocker_places.as_json(include :place_category))
  end

  def show
    render json: fmt(ok, @stocker_place.as_json(include :place_category))
  end

  def create
    @stocker_place = StockerPlace.create(stocker_place_params)
    render json: fmt(created, @stocker_place)
  end

  def update
    @stocker_place.update(stocker_place_params)
    render json: fmt(created, @stocker_place, "Updated stocker_place id = #{params[:id]}")
  end

  def destroy
    @stocker_place.destroy
    render json: fmt(ok, [], "Deleted stocker_place = #{params[:id]}")
  end

  private

  # Use callbacks to share common setup or constraints between actions.
  def set_stocker_place
    if StockerPlace.exists?(params[:id])
      @stocker_place = StockerPlace.find(params[:id])
    else
      render json: fmt(not_found, [], "Not found stocker_place = #{params[:id]}")
    end
  end

  # Only allow a list of trusted parameters through.
  def stocker_place_params
    params.permit(:name, :name_en, :stock_item_status, :assign_item_status, :place_category_id)
  end
end
