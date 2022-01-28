class Api::V1::StageOrdersApiController < ApplicationController

  def get_stage_order_index_for_admin_view
    @stage_orders = StageOrder.with_groups
    render json: fmt(ok, @stage_orders)
  end

  def get_stage_order_show_for_admin_view
    @stage_order = StageOrder.with_group(params[:id])
    render json: fmt(ok, @stage_order)
  end

end
