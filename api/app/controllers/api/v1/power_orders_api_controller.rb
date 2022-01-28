class Api::V1::PowerOrdersApiController < ApplicationController

  def get_power_order_index_for_admin_view
    @power_orders = PowerOrder.with_groups
    render json: fmt(ok, @power_orders)
  end

  def get_power_order_show_for_admin_view
    @power_order = PowerOrder.with_group_and_place_order(params[:id])
    render json: fmt(ok, @power_order)
  end

end
