class Api::V1::PurchaseListsApiController < ApplicationController

  def get_purchase_list_index_for_admin_view
    @purchase_lists = PurchaseList.with_groups_and_info
    render json: fmt(ok, @purchase_lists)
  end

  def get_purchase_list_show_for_admin_view
    @purchase_list = PurchaseList.with_group_and_info(params[:id])
    render json: fmt(ok, @purchase_list)
  end

end
