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
end
