class Api::V1::PlaceOrdersApiController < ApplicationController

  def get_place_orders
    # 使用会場一覧を取得する
    place_orders = PlaceOrder.all
    place_orders_lists = []
    for place_order in place_orders
      group = place_order.group.name
      first = Place.find(place_order.first).name
      second = Place.find(place_order.second).name
      third = Place.find(place_order.third).name
      place_orders_lists << {
        place_order: place_order,
        group: group,
        first: first,
        second: second,
        third: third,
      }
    end
    render json: place_orders_lists
  end

  def get_place_order
    # 使用会場の詳細を取得する
    place_order = PlaceOrder.find(params[:id])
    group = place_order.group
    group_name = place_order.group.name
    first = Place.find(place_order.first).name
    second = Place.find(place_order.second).name
    third = Place.find(place_order.third).name
    power_orders = group.power_orders
    total_power = 0
    for power_order in power_orders
      total_power += power_order.power
    end
    place_order_list = []
    place_order_list = {
      place_order: place_order,
      group: group,
      group_name: group_name,
      first: first,
      second: second,
      third: third,
      power_orders: power_orders,
      total_power: total_power,
    }
    render json: place_order_list
  end

  #絞り込み機能
  def get_refinement_place_orders
    fes_year_id = params[:fes_year_id].to_i 
    place_id = params[:place_id].to_i
    #両方ともALL
    if fes_year_id == 0 && place_id == 0
      @place_orders = PlaceOrder.all
      #fes_year_idだけ指定
    elsif fes_year_id != 0 && place_id == 0 
      @place_orders = Group.where(fes_year_id: fes_year_id).preload(:place_order).map{ |group| group.place_order }
      #place_idだけ指定
    elsif fes_year_id == 0 && place_id != 0
      @place_orders = PlaceOrder.where("(first = ?) OR (second = ?) OR (third = ?)", place_id, place_id, place_id)
      #両方とも指定
    else
      @place_orders = PlaceOrder.where("(first = ?) OR (second = ?) OR (third = ?)", place_id, place_id, place_id).map{ |place_order| place_order if place_order.group.fes_year_id == fes_year_id }.compact 
    end

    if @place_orders.count == 0
      render json: fmt(not_found, [], "Not found place_orders")
    else 
      render json: fmt(ok, @place_orders)
    end
  end

  #あいまい検索
  def get_search_place_orders
    word = params[:word]
    @place_orders = Group.where("name like ?", "%#{word}%").preload(:place_order).map{ |group| group.place_order } 
    if @place_orders.count == 0
      render json: fmt(not_found, [], "Not found place_orders")
    else
      render json: fmt(ok, @place_orders)
    end
  end

end
