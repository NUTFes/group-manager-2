# frozen_string_literal: true

class PlaceCategoriesController < ApplicationController
  before_action :set_place_category, only: %i[show update destroy]
  
  def index
    @place_categories = PlaceCategory.all
    render json: fmt(ok, @place_categories)
  end

  def show
    render json: fmt(ok, @place_category)
  end

  def create
    @place_category = PlaceCategory.create(place_category_params)
    render json: fmt(ok, @place_category)
  end

  def update
    @place_category.update(place_category_params)
    render json: fmt(created, @place_category, "Updated place_category id = #{params[:id]}")
  end

  def destroy
    @place_category.destroy
    render json: fmt(ok, [], "Deleted place_category = #{params[:id]}")
  end

  private

  def set_place_category
    if PlaceCategory.exists?(params[:id])
      @place_category = PlaceCategory.find(params[:id])
    else
      render json: fmt(not_found, [], "Not found place_category = #{params[:id]}")
    end
  end

  def place_category_params
    params.permit(:name, :parent_id)
  end
end 