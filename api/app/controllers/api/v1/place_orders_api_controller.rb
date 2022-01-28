class Api::V1::PlaceOrdersApiController < ApplicationController

  def get_place_order_index_for_admin_view
    @place_orders = PlaceOrder.get_with_groups
    render json: fmt(ok, @place_orders)
  end

  def get_place_order_show_for_admin_view
    @place_order = PlaceOrder.get_with_group(params[:id])
    render json: fmt(ok, @place_order)
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
