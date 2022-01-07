class ShopsController < ApplicationController
  before_action :set_shop, only: [:show, :update, :destroy]

  def index
    @shops = Shop.all
    render json: fmt(ok, @shops)
  end

  def show
    render json: fmt(ok, @shop)
  end

  def create
    @shop = Shop.create(shop_params)
    render json: fmt(created, @shop) 
  end

  def update
    @shop.update(shop_params)
    render json: fmt(created, @shop, "Updated shop id = "+params[:id])
  end

  def destroy
    @shop.destroy
    render json: fmt(ok, [], "Deleted shop = "+params[:id])
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_shop
      if Shop.exists?(params[:id])
        @shop = Shop.find(params[:id])
      else
        render json: fmt(not_found, [], "Not found shop = "+params[:id])
      end
    end

    # Only allow a list of trusted parameters through.
    def shop_params
      params.permit(:name, :tel, :opening_hours, :address)
    end
end
