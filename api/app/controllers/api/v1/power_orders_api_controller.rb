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
    group = power_order.group.name
    power_order_list = {
      power_order: power_order,
      group: group,
    }
    render json: power_order_list
  end
end
