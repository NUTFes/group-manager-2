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
    group = place_order.group.name
    first = Place.find(place_order.first).name
    second = Place.find(place_order.second).name
    third = Place.find(place_order.third).name
    place_order_list = []
    place_order_list = {
      place_order: place_order,
      group: group,
      first: first,
      second: second,
      third: third,
    }
    render json: place_order_list
  end

end
