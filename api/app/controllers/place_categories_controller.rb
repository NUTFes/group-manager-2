# frozen_string_literal: true

class PlaceCategoriesController < ApplicationController
  before_action :set_place_category, only: %i[show update destroy]

  def index
    render json: fmt(ok, PlaceCategory.hierarchy_for_index)
  end

  def show
    render json: fmt(ok, @place_category.as_json(methods: place_category_methods))
  end

  def create
    @place_category = PlaceCategory.new(place_category_params)
    if @place_category.save
      render json: fmt(ok, @place_category.as_json(methods: place_category_methods)), status: :created
    else
      render json: fmt(unprocessable_entity, @place_category.errors.full_messages), status: :unprocessable_entity
    end
  end

  def update
    if @place_category.update(place_category_params)
      render json: fmt(ok, @place_category.as_json(methods: place_category_methods), "Updated place_category id = #{params[:id]}"), status: :ok
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

  def place_category_methods
    %i[
      formatted_name
      parent_name
      children_count
      descendant_ids
      stocker_places_count
    ]
  end

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
