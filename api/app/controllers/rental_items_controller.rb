# frozen_string_literal: true

class RentalItemsController < ApplicationController
  before_action :set_rental_item, only: %i[show update destroy]

  def index
    @rental_items = RentalItem.all
    render json: fmt(ok, @rental_items)
  end

  def show
    render json: fmt(ok, @rental_item)
  end

  def create
    params[:name_en] = translate_to_en(params[:name]) if params[:name_en].blank?
    @rental_item = RentalItem.create(rental_item_params)
    render json: fmt(created, @rental_item)
  end

  def update
    params[:name_en] = translate_to_en(params[:name]) if params[:name_en].blank?
    @rental_item.update(rental_item_params)
    render json: fmt(created, @rental_item, "Updated rental_item id = #{params[:id]}")
  end

  def destroy
    @rental_item.destroy
    render json: fmt(ok, [], "Deleted rental_item = #{params[:id]}")
  end

  def translate
    translated = translate_to_en(params[:text])
    render json: fmt(ok, { name_en: translated })
  end

  private

  # Use callbacks to share common setup or constraints between actions.
  def set_rental_item
    if RentalItem.exists?(params[:id])
      @rental_item = RentalItem.find(params[:id])
    else
      render json: fmt(not_found, [], "Not found rental_item = #{params[:id]}")
    end
  end

  # Only allow a list of trusted parameters through.
  def rental_item_params
    params.permit(:name, :name_en, :is_inside_shop_rentable, :is_outside_shop_rentable, :is_stage_rentable)
  end
end
