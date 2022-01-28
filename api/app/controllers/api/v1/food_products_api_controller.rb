class Api::V1::FoodProductsApiController < ApplicationController

  def get_food_product_index_for_admin_view
    @food_products = FoodProduct.with_groups
    render json: fmt(ok, @food_products)
  end

  def get_food_product_show_for_admin_view
    @food_product = FoodProduct.with_group(params[:id])
    render json: fmt(ok, @food_product)
  end

end
