class Api::V1::PowerOrdersApiController < ApplicationController

  def get_power_orders
    # 電力申請の一覧を取得する
    power_orders = PowerOrder.all
    power_orders_list = []
    for power_order in power_orders
      group = power_order.group.name
      power_orders_list << {
        power_order: power_order,
        group: group,
      }
    end
    render json: power_orders_list
  end

  def get_power_order
    # 電力申請の詳細を取得する
    power_order = PowerOrder.find(params[:id])
    power_order_list = []
    group_name = power_order.group.name

    group = power_order.group
    power_orders = group.power_orders

    place_order = group.place_order
    first = Place.find(place_order.first).name
    second = Place.find(place_order.second).name
    third = Place.find(place_order.third).name    
    
    total_power = 0
    for power_ord in power_orders
      total_power += power_ord.power
    end
    power_order_list = {
      power_order: power_order,
      power_orders: power_orders,
      group_name: group_name,
      total_power: total_power,
      first: first,
      second: second,
      third: third,
    }
    render json: power_order_list
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
