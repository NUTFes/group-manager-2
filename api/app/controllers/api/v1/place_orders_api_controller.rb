# frozen_string_literal: true

class Api::V1::PlaceOrdersApiController < Api::V1::StaffController
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
    place_orders.map do |place_order|
      {
        place_order: place_order,
        place_order_name: place_order.to_place_name_h,
        group: place_order.group
      }
    end
  end

  # 絞り込み機能
  def get_refinement_place_orders
    fes_year_id = params[:fes_year_id].to_i
    place_id = params[:place_id].to_i
    group_category_id = params[:group_category_id].to_i

    @place_orders = PlaceOrder.preload(:group)

    # fes_year_id で絞り込み
    @place_orders = @place_orders.joins(:group).where(groups: { fes_year_id: fes_year_id }) if fes_year_id != 0

    # place_id で絞り込み
    @place_orders = @place_orders.where('(first = ?) OR (second = ?) OR (third = ?)', place_id, place_id, place_id) if place_id != 0

    # group_category_id で絞り込み
    @place_orders = @place_orders.joins(:group).where(groups: { group_category_id: group_category_id }) if group_category_id != 0

    if @place_orders.empty?
      render json: fmt(not_found, [], 'Not found place_orders')
    else
      render json: fmt(ok, fit_place_order_index_for_admin_view(@place_orders))
    end
  end

  # あいまい検索
  def get_search_place_orders
    word = params[:word]
    @place_orders = PlaceOrder.all.select { |place_order| place_order.group.name.include?(word) || place_order.to_place_name_h[:first].include?(word) || place_order.to_place_name_h[:second].include?(word) || place_order.to_place_name_h[:third].include?(word) }
    if @place_orders.none?
      render json: fmt(not_found, [], 'Not found place_orders')
    else
      render json: fmt(ok, fit_place_order_index_for_admin_view(@place_orders))
    end
  end
end
