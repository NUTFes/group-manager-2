class Api::V1::RentalOrdersApiController < ApplicationController

  def get_rental_orders
    # 物品申請一覧を取得する
    rental_orders = RentalOrder.all
    rental_order_list = []
    for rental_order in rental_orders
      group = rental_order.group.name
      item = rental_order.rental_item.name
      rental_order_list << {
        rental_order: rental_order,
        group: group,
        item: item
      }
    end
    render json: rental_order_list
  end

  def get_rental_order
    # 物品申請の詳細を取得する
    rental_order = RentalOrder.find(params[:id])
    rental_order_list = []
    group = rental_order.group.name
    item = rental_order.rental_item.name
    rental_order_list = {
      rental_order: rental_order,
      group: group,
      item: item
    }
    render json: rental_order_list
  end

end
