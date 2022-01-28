class Api::V1::RentalOrdersApiController < ApplicationController

  def get_rental_order_index_for_admin_view
    @rental_orders = RentalOrder.with_groups_and_rental_item
    render json: fmt(ok, @rental_orders)
  end

  def get_rental_order_show_for_admin_view
    @rental_order = RentalOrder.with_rental_item(params[:id])
    render json: fmt(ok, @rental_order)
  end

end
