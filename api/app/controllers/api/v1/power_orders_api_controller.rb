# frozen_string_literal: true

class Api::V1::PowerOrdersApiController < Api::V1::StaffController
  def get_power_order_index_for_admin_view
    @power_orders = PowerOrder.with_groups
    render json: fmt(ok, @power_orders)
  end

  def get_power_order_show_for_admin_view
    @power_order = PowerOrder.with_group_and_place_order(params[:id])
    render json: fmt(ok, @power_order)
  end

  # admin_pageのviewの形に整える
  def fit_power_order_index_for_admin_view(power_orders)
    power_orders.map do |power_order|
      {
        power_order: power_order,
        group: power_order.group
      }
    end
  end

  # 絞り込み機能
  def get_refinement_power_orders
    fes_year_id = params[:fes_year_id].to_i
    power = params[:power].to_i
    group_category_id = params[:group_category_id].to_i

    # fes_year_id, power, category_idで絞り込み
    @power_orders = PowerOrder.all
    @power_orders = @power_orders.joins(:group).where(groups: { fes_year_id: fes_year_id }) if fes_year_id != 0
    @power_orders = @power_orders.preload(:group).where(power: power..) if power != 0
    @power_orders = @power_orders.joins(:group).where(groups: { group_category_id: group_category_id }) if group_category_id != 0

    if @power_orders.none?
      render json: fmt(not_found, [], 'Not found power_orders')
    else
      render json: fmt(ok, fit_power_order_index_for_admin_view(@power_orders))
    end
  end

  # あいまい検索
  def get_search_power_orders
    word = params[:word]
    @power_orders = PowerOrder.all.select { |power_order| power_order.group.name.include?(word) || power_order.item.include?(word) }
    if @power_orders.none?
      render json: fmt(not_found, [], 'Not found power_orders')
    else
      render json: fmt(ok, fit_power_order_index_for_admin_view(@power_orders))
    end
  end
end
