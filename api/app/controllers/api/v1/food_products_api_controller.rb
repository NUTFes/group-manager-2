class Api::V1::FoodProductsApiController < ApplicationController

  def get_food_products
    # 販売食品一覧を取得する
    food_products = FoodProduct.all
    food_products_list = []
    for food_product in food_products
      group = food_product.group.name
      food_products_list << {
        food_product: food_product,
        group: group,
      }
    end
    render json: food_products_list
  end

  def get_food_product
    # 販売食品の詳細を取得する
    food_product = FoodProduct.find(params[:id])
    food_products_list = []
    group = food_product.group.name
    food_products_list = {
      food_product: food_product,
      group: group,
    }
    render json: food_products_list
  end

  def get_food_products_from_group
    food_products = FoodProduct.where(group_id:params[:id])
    render json: food_products
  end

  def get_group_food_product
    # グループが持つ販売食品を取得する
    @food_products = FoodProduct.where(group_id: params[:group_id])
    render json: @food_products
  end

end
