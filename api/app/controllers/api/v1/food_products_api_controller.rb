class Api::V1::FoodProductsApiController < ApplicationController

  def get_food_product_index_for_admin_view
    @food_products = FoodProduct.with_groups
    render json: fmt(ok, @food_products)
  end

  def get_food_product_show_for_admin_view
    @food_product = FoodProduct.with_group(params[:id])
    render json: fmt(ok, @food_product)
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
