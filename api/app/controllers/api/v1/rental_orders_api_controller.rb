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

  # 絞り込み機能
  def get_refinement_rental_orders
    fes_year_id = params[:fes_year_id].to_i
    rental_item_id = params[:rental_item_id].to_i
    # 両方ともALL
    if fes_year_id == 0 && rental_item_id == 0
      @rental_orders = RentalOrder.all
      #fes_year_idだけ指定
    elsif fes_year_id != 0 && rental_item_id == 0 
      @rental_orders = Group.where(fes_year_id: fes_year_id).preload(:rental_orders).map{ |group| group.rental_orders }
      #rental_item_idだけ指定
    elsif fes_year_id == 0 && rental_item_id != 0
      @rental_orders = RentalOrder.where(rental_item_id: rental_item_id)
      #両方とも指定
    else
      @rental_orders = Group.where(fes_year_id: fes_year_id).preload(:rental_orders).map{ |group| group.rental_orders.where(rental_item_id: rental_item_id) }  
    end

    if @rental_orders.count == 0
      render json: fmt(not_found, [], "Not found rental_orders")
    else 
      render json: fmt(ok, @rental_orders)
    end
  end

  #あいまい検索
  def get_search_rental_orders
    word = params[:word]
    @rental_orders = Group.where("name like ?", "%#{word}%").preload(:rental_orders).map{ |group| group.rental_orders } 
    if @rental_orders.count == 0
      render json: fmt(not_found, [], "Not found rental_orders")
    else
      render json: fmt(ok, @rental_orders)
    end
  end
  
end
