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
    category_id = params[:category_id].to_i
    search_word = params[:word]
    # is_cooking
    # 0: 指定なし(ALL), 1: 調理あり(true), 2: 調理なし(false)
    # category_id
    # 0: 指定なし(ALL), 1: 食品販売, 2: 物品販売
    # word あるかないか
    # 全部ALL
    if fes_year_id == 0 && is_cooking == 0 && category_id == 0
      @food_products = FoodProduct.all
    # fes_year_idだけ指定
    elsif fes_year_id != 0 && is_cooking == 0 && category_id == 0
      @food_products = FoodProduct.preload(:group).map{ |food_product| food_product if food_product.group.fes_year_id == fes_year_id }.compact
    # is_cookingだけ指定
    elsif fes_year_id == 0 && is_cooking != 0 && category_id == 0
      @food_products = FoodProduct.where(is_cooking: is_cooking_list[is_cooking])
    # category_idだけ指定
    elsif fes_year_id == 0 && is_cooking == 0 && category_id != 0
      @food_products = FoodProduct.preload(:group).map{ |food_product| food_product if food_product.group.group_category_id == category_id }.compact
    # fes_year_idとis_cookingの指定
    elsif fes_year_id != 0 && is_cooking != 0 && category_id == 0
      @food_products = FoodProduct.where(is_cooking: is_cooking_list[is_cooking]).map{ |food_product| food_product if food_product.group.fes_year_id == fes_year_id }.compact
    # fes_year_idとcategory_idの指定
    elsif fes_year_id != 0 && is_cooking == 0 && category_id != 0
      @food_products = FoodProduct.preload(:group).map{ |food_product| food_product if food_product.group.fes_year_id == fes_year_id && food_product.group.group_category_id == category_id }.compact
    # is_cookingとcategory_idの指定
    elsif fes_year_id == 0 && is_cooking != 0 && category_id != 0
      @food_products = FoodProduct.where(is_cooking: is_cooking_list[is_cooking]).map{ |food_product| food_product if food_product.group.group_category_id == category_id }.compact
    # 全部指定
    else
      @food_products = FoodProduct.where(is_cooking: is_cooking_list[is_cooking]).map{ |food_product| food_product if food_product.group.fes_year_id == fes_year_id && food_product.group.group_category_id == category_id }.compact
    end

    if search_word.present?
      # 文字列検索
      @food_products = @food_products.map{ |food_product| food_product if food_product.group.name.include?(search_word) || food_product.name.include?(search_word) }.compact
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

  # group_idに紐づいたfood_productsの取得
  def get_food_products_by_group_id
    group_id = params[:group_id]
    @food_products = FoodProduct.where(group_id: group_id)
    if @food_products.count == 0
      render json: fmt(not_found, [], "Not found food_products")
    else
      render json: fmt(ok, @food_products)
    end
  end

end
