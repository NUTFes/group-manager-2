class Api::V1::FoodProductsApiController < ApplicationController

  def get_food_product_index_for_admin_view
    @food_products = FoodProduct.with_groups
    render json: fmt(ok, @food_products)
  end

  def get_food_product_show_for_admin_view
    @food_product = FoodProduct.with_group(params[:id])
    render json: fmt(ok, @food_product)
  end

  # admin_pageのviewの形に整える
  def fit_food_product_index_for_admin_view(food_products)
    food_products.map{
      |food_product|
      {
        "food_product": food_product,
        "group": food_product.group
      }
    }
  end

  #絞り込み機能
  def get_refinement_food_products
    fes_year_id = params[:fes_year_id].to_i
    is_cooking = params[:is_cooking].to_i
    is_cooking_list = [nil, true, false]
    # is_cooking
    # 0: 指定なし(ALL), 1: 調理あり(true), 2: 調理なし(false)
    # 両方ともALL
    if fes_year_id == 0 && is_cooking == 0
      @food_products = FoodProduct.all
    # fes_year_idだけ指定
    elsif fes_year_id != 0 && is_cooking == 0
      @food_products = FoodProduct.preload(:group).map{ |food_product| food_product if food_product.group.fes_year_id == fes_year_id }.compact
    # is_cookingだけ指定
    elsif fes_year_id == 0 && is_cooking != 0
      @food_products = FoodProduct.where(is_cooking: is_cooking_list[is_cooking])
    # 両方指定
    else
      @food_products = FoodProduct.where(is_cooking: is_cooking_list[is_cooking]).map{ |food_product| food_product if food_product.group.fes_year_id == fes_year_id }.compact
    end

    if @food_products.count == 0
      render json: fmt(not_found, [], "Not found food_products")
    else 
      render json: fmt(ok, fit_food_product_index_for_admin_view(@food_products))
    end
  end

  #あいまい検索
  def get_search_food_products
    word = params[:word]
    @food_products = FoodProduct.all.map{ |food_product| food_product if food_product.group.name.include?(word) || food_product.name.include?(word) }.compact
    if @food_products.count == 0
      render json: fmt(not_found, [], "Not found food_products")
    else
      render json: fmt(ok, fit_food_product_index_for_admin_view(@food_products))
    end
  end

end
