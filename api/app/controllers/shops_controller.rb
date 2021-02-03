class ShopsController < ApplicationController
  before_action :set_shop, only: [:show, :update, :destroy]

  def index
    @shops = Shop.all
    render json: @shops
  end

  def show
    render json: @shop
  end

  def create
    @shop = Shop.new(shop_params)
    @shop.save
  end

  def update
    @shop.update(shop_params)
  end

  def destroy
    @shop.destroy
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_shop
      @shop = Shop.find(params[:id])
    end

    # Only allow a list of trusted parameters through.
    def shop_params
      params.permit(:name, :tel, :opening_hours, :address)
    end
end
