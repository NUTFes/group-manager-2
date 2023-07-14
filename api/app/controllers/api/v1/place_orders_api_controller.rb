class Api::V1::PlaceOrdersApiController < ApplicationController

  def get_place_order_index_for_admin_view
    @place_orders = PlaceOrder.get_with_groups
    render json: fmt(ok, @place_orders)
  end

  def get_place_order_show_for_admin_view
    @place_order = PlaceOrder.get_with_group(params[:id])
    render json: fmt(ok, @place_order)
  end

  # admin_pageのviewの形に整える
  def fit_place_order_index_for_admin_view(place_orders)
    place_orders.map{
      |place_order|
      {
        "place_order": place_order,
        "place_order_name": place_order.to_place_name_h,
        "group": place_order.group
      }
    }
  end

  #絞り込み機能
  def get_refinement_place_orders
    fes_year_id = params[:fes_year_id].to_i 
    place_id = params[:place_id].to_i
    group_category_id = params[:group_category_id].to_i

    @place_orders = PlaceOrder.preload(:group)

    # fes_year_id で絞り込み
    if fes_year_id != 0
      @place_orders = @place_orders.joins(:group).where(groups: { fes_year_id: fes_year_id })
    end

    # place_id で絞り込み
    if place_id != 0
      @place_orders = @place_orders.where("(first = ?) OR (second = ?) OR (third = ?)", place_id, place_id, place_id)
    end

    # group_category_id で絞り込み
    if group_category_id != 0
      @place_orders = @place_orders.joins(:group).where(groups: { group_category_id: group_category_id })
    end

    if @place_orders.empty?
      render json: fmt(not_found, [], "Not found place_orders")
    else 
      render json: fmt(ok, fit_place_order_index_for_admin_view(@place_orders))
    end
  end

  #あいまい検索
  def get_search_place_orders
    word = params[:word]
    @place_orders = PlaceOrder.all.map{ |place_order| place_order if place_order.group.name.include?(word) || place_order.to_place_name_h[:first].include?(word) || place_order.to_place_name_h[:second].include?(word) || place_order.to_place_name_h[:third].include?(word)}.compact
    if @place_orders.count == 0
      render json: fmt(not_found, [], "Not found place_orders")
    else
      render json: fmt(ok, fit_place_order_index_for_admin_view(@place_orders))
    end
  end

end
