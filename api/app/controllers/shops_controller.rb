# frozen_string_literal: true

class ShopsController < ApplicationController
  before_action :set_shop, only: %i[show update destroy]

  def index
    @shops = Shop.all
    render json: fmt(ok, @shops)
  end

  def show
    render json: fmt(ok, @shop)
  end

  def create
    max_attempts = 3
    attempts = 0
    begin
      attempts += 1
      new_id = Shop.next_regular_id
      @shop = Shop.create(shop_params.to_h.merge(id: new_id))
      render json: fmt(created, @shop) and return
    rescue ActiveRecord::RecordNotUnique => e
      retry if attempts < max_attempts
      render json: fmt(internal_server_error, [], "Failed to create shop after #{max_attempts} attempts: #{e.message}")
    end
  end

  def update
    @shop.update(shop_params)
    render json: fmt(created, @shop, "Updated shop id = #{params[:id]}")
  end

  def destroy
    @shop.destroy
    render json: fmt(ok, [], "Deleted shop = #{params[:id]}")
  end

  private

  # Use callbacks to share common setup or constraints between actions.
  def set_shop
    if Shop.exists?(params[:id])
      @shop = Shop.find(params[:id])
    else
      render json: fmt(not_found, [], "Not found shop = #{params[:id]}")
    end
  end

  # Only allow a list of trusted parameters through.
  def shop_params
    params.permit(:name, :tel, :opening_hours, :address)
  end
end
