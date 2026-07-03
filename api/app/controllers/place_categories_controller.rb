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
    @place_category = PlaceCategory.new(place_category_params)
    if @place_category.save
      render json: fmt(ok, @place_category), status: :created
    else
      render json: fmt(unprocessable_entity, @place_category.errors.full_messages), status: :unprocessable_entity
    end
  end

  def update
    if @place_category.update(place_category_params)
      render json: fmt(ok, @place_category, "Updated place_category id = #{params[:id]}"), status: :ok
    else
      render json: fmt(unprocessable_entity, @place_category.errors.full_messages), status: :unprocessable_entity
    end
  end

  def destroy
    if @place_category.destroy
      render json: fmt(ok, [], "Deleted place_category = #{params[:id]}")
    else
      render json: fmt(internal_server_error, @place_category.errors.full_messages), status: :internal_server_error
    end
  end

  private

  def set_place_category
    if PlaceCategory.exists?(params[:id])
      @place_category = PlaceCategory.find(params[:id])
    else
      render json: fmt(not_found, [], "Not found place_category = #{params[:id]}"), status: :not_found
    end
  end

  def place_category_params
    params.permit(:name, :parent_id)
  end
end
