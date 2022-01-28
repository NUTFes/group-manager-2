class Api::V1::PlaceOrdersApiController < ApplicationController

  def get_place_order_index_for_admin_view
    @place_orders = PlaceOrder.get_with_groups
    render json: fmt(ok, @place_orders)
  end

  def get_place_order_show_for_admin_view
    @place_order = PlaceOrder.get_with_group(params[:id])
    render json: fmt(ok, @place_order)
  end

end
