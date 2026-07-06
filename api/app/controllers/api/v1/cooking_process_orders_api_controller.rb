# frozen_string_literal: true

class Api::V1::CookingProcessOrdersApiController < Api::V1::BaseController
  def get_cooking_process_order_for_admin_view
    @groups = Group.with_cooking_process_order(params[:id])
    render json: fmt(ok, @groups)
  end

  # 絞り込み機能
  def get_refinement_cooking_process_orders
    fes_year_id = params[:fes_year_id].to_i

    @food_products = FoodProduct.joins(:group).includes(:group, :cooking_process_order)

    @food_products = @food_products.where(groups: { fes_year_id: fes_year_id }) if fes_year_id != 0

    @food_products = @food_products.order('groups.id')

    if @food_products.empty?
      render json: fmt(not_found, [], 'Not found food products')
    else
      render json: fmt(ok, @food_products.as_json(include: %i[group cooking_process_order]))
    end
  end

  # あいまい検索機能
  def get_search_cooking_process_orders
    word = params[:word]
    @food_products = FoodProduct.joins(:group).includes(:group, :cooking_process_order)
                                .where('food_products.name LIKE :word OR groups.name LIKE :word', word: "%#{word}%")
                                .order('groups.id')

    if @food_products.empty?
      render json: fmt(not_found, [], 'Not found food products')
    else
      render json: fmt(ok, @food_products.as_json(include: %i[group cooking_process_order]))
    end
  end

  # GET /api/v1/get_cooking_process_order_by_food_product_id/:food_product_id - 販売品IDに紐づく調理工程申請を取得
  def get_cooking_process_order_by_food_product_id
    @cooking_process_order = CookingProcessOrder.with_group_by_food_product_id(params[:food_product_id])
    render json: fmt(ok, @cooking_process_order)
  end
end
