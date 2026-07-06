# frozen_string_literal: true

class Api::V1::FoodProductsApiController < Api::V1::BaseController
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
    food_products.map do |food_product|
      {
        food_product: food_product,
        group: food_product.group
      }
    end
  end

  # 絞り込み機能
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
    @food_products = if fes_year_id == 0 && is_cooking == 0 && category_id == 0
                       FoodProduct.all
                     # fes_year_idだけ指定
                     elsif fes_year_id != 0 && is_cooking == 0 && category_id == 0
                       FoodProduct.preload(:group).select { |food_product| food_product.group.fes_year_id == fes_year_id }
                     # is_cookingだけ指定
                     elsif fes_year_id == 0 && is_cooking != 0 && category_id == 0
                       FoodProduct.where(is_cooking: is_cooking_list[is_cooking])
                     # category_idだけ指定
                     elsif fes_year_id == 0 && is_cooking == 0 && category_id != 0
                       FoodProduct.preload(:group).select { |food_product| food_product.group.group_category_id == category_id }
                     # fes_year_idとis_cookingの指定
                     elsif fes_year_id != 0 && is_cooking != 0 && category_id == 0
                       FoodProduct.where(is_cooking: is_cooking_list[is_cooking]).select { |food_product| food_product.group.fes_year_id == fes_year_id }
                     # fes_year_idとcategory_idの指定
                     elsif fes_year_id != 0 && is_cooking == 0 && category_id != 0
                       FoodProduct.preload(:group).select { |food_product| food_product.group.fes_year_id == fes_year_id && food_product.group.group_category_id == category_id }
                     # is_cookingとcategory_idの指定
                     elsif fes_year_id == 0 && is_cooking != 0 && category_id != 0
                       FoodProduct.where(is_cooking: is_cooking_list[is_cooking]).select { |food_product| food_product.group.group_category_id == category_id }
                     # 全部指定
                     else
                       FoodProduct.where(is_cooking: is_cooking_list[is_cooking]).select { |food_product| food_product.group.fes_year_id == fes_year_id && food_product.group.group_category_id == category_id }
                     end

    if search_word.present?
      # 文字列検索
      @food_products = @food_products.select { |food_product| food_product.group.name.include?(search_word) || food_product.name.include?(search_word) }
    end

    if @food_products.none?
      render json: fmt(not_found, [], 'Not found food_products')
    else
      render json: fmt(ok, fit_food_product_index_for_admin_view(@food_products))
    end
  end

  # あいまい検索
  def get_search_food_products
    word = params[:word]
    @food_products = FoodProduct.all.select { |food_product| food_product.group.name.include?(word) || food_product.name.include?(word) }
    if @food_products.none?
      render json: fmt(not_found, [], 'Not found food_products')
    else
      render json: fmt(ok, fit_food_product_index_for_admin_view(@food_products))
    end
  end

  # group_idに紐づいたfood_productsの取得
  def get_food_products_by_group_id
    group_id = params[:group_id]
    @food_products = FoodProduct.where(group_id: group_id)
    if @food_products.none?
      render json: fmt(not_found, [], 'Not found food_products')
    else
      render json: fmt(ok, @food_products)
    end
  end

  def get_food_products_have_no_cooking_process_order
    @food_products = FoodProduct.where.missing(:cooking_process_order)
                                .where(is_cooking: true)
    render json: fmt(ok, @food_products.as_json(include: :group))
  end
end
