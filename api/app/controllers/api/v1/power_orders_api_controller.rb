class Api::V1::PowerOrdersApiController < ApplicationController

  def get_power_order_index_for_admin_view
    @power_orders = PowerOrder.with_groups
    render json: fmt(ok, @power_orders)
  end

  def get_power_order_show_for_admin_view
    @power_order = PowerOrder.with_group_and_place_order(params[:id])
    render json: fmt(ok, @power_order)
  end

  #絞り込み機能
  def get_refinement_power_orders
    fes_year_id = params[:fes_year_id].to_i
    power = params[:power].to_i
    # 両方ともALL
    if fes_year_id == 0 && power == 0
      @power_orders = PowerOrder.all
      #fes_year_idだけ指定
    elsif fes_year_id != 0 && power == 0 
      @power_orders = Group.where(fes_year_id: fes_year_id).preload(:power_orders).map{ |group| group.power_orders }
      #rental_item_idだけ指定
    elsif fes_year_id == 0 && power != 0
      @power_orders = PowerOrder.where("(power >= ?)", power)
      #両方とも指定
    else
      @power_orders = Group.where(fes_year_id: fes_year_id).preload(:power_orders).map{ |group| group.power_orders.where("(power >= ?)", power) }  
    end

    if @power_orders.count == 0
      render json: fmt(not_found, [], "Not found power_orders")
    else 
      render json: fmt(ok, @power_orders)
    end
  end

  #あいまい検索
  def get_search_power_orders
    word = params[:word]
    @power_orders = Group.where("name like ?", "%#{word}%").preload(:power_orders).map{ |group| group.power_orders } 
    if @power_orders.count == 0
      render json: fmt(not_found, [], "Not found power_orders")
    else
      render json: fmt(ok, @power_orders)
    end
  end

end
