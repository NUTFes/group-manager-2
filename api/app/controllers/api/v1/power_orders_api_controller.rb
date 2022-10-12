class Api::V1::PowerOrdersApiController < ApplicationController

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
    power_orders.map{
      |power_order|
      {
        "power_order": power_order,
        "group": power_order.group,
      }
    }
  end

  #絞り込み機能
  def get_refinement_power_orders
    fes_year_id = params[:fes_year_id].to_i
    power = params[:power].to_i
    is_committee = params[:is_committee].to_i

    option_list = [nil, true, false] # 0: 指定なし(ALL) 1: true 2: false

    # 両方ともALL
    if fes_year_id == 0 && power == 0
      @power_orders = PowerOrder.all
      #fes_year_idだけ指定
    elsif fes_year_id != 0 && power == 0
      @power_orders = PowerOrder.preload(:group).map{ |power_order| power_order if power_order.group.fes_year_id == fes_year_id }.compact
      #rental_item_idだけ指定
    elsif fes_year_id == 0 && power != 0
      @power_orders = PowerOrder.preload(:group).where("(power >= ?)", power)
      #両方とも指定
    else
      @power_orders = PowerOrder.preload(:group).where("(power >= ?)", power).map{ |power_order| power_order if power_order.group.fes_year_id == fes_year_id }.compact
    end

    # is_committeeで絞り込み
    if is_committee == 0
      @power_orders = PowerOrder.all
    else
      @power_orders = PowerOrder.where(is_committee: option_list[is_committee])
    end

    if @power_orders.count == 0
      render json: fmt(not_found, [], "Not found power_orders")
    else
      render json: fmt(ok, fit_power_order_index_for_admin_view(@power_orders))
    end
  end

  #あいまい検索
  def get_search_power_orders
    word = params[:word]
    @power_orders = PowerOrder.all.map{ |power_order| power_order if power_order.group.name.include?(word) || power_order.item.include?(word) }.compact
    if @power_orders.count == 0
      render json: fmt(not_found, [], "Not found power_orders")
    else
      render json: fmt(ok, fit_power_order_index_for_admin_view(@power_orders))
    end
  end

end
