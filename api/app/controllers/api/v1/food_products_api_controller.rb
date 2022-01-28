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

  #絞り込み機能
  def get_refinement_food_products
    fes_year_id = params[:fes_year_id].to_i
    is_cooking = params[:is_cooking]
    if is_cooking
      if fes_year_id == 0
        @food_products = FoodProduct.where(is_cooking: is_cooking)
      else
        @food_products = Group.where(fes_year_id: fes_year_id).preload(:food_products).map{ |group| group.food_products.where(is_cooking: is_cooking) }
      end
    else
      if fes_year_id == 0
        @food_products = FoodProduct.all
      else
        @food_products = Group.where(fes_year_id: fes_year_id).preload(:food_products).map{ |group| group.food_products }
      end
    end

    if @food_products.count == 0  
      render json: fmt(not_found, [], "Not found food_products")
    else 
      render json: fmt(ok, @food_products)
    end
  end

  #あいまい検索
  def get_search_food_product
    word = params[:word]
    @food_products = Group.where("name like ?", "%#{word}%").preload(:food_products).map{ |group| group.food_products } 
    if @food_products.count == 0
      render json: fmt(not_found, [], "Not found food_products")
    else
      render json: fmt(ok, @food_products)
    end
  end

end
