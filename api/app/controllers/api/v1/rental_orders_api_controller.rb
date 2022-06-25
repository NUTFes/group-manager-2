class Api::V1::RentalOrdersApiController < ApplicationController

  def get_rental_order_index_for_admin_view
    @rental_orders = RentalOrder.with_groups_and_rental_item
    render json: fmt(ok, @rental_orders)
  end

  def get_rental_order_show_for_admin_view
    @rental_order = RentalOrder.with_rental_item(params[:id])
    render json: fmt(ok, @rental_order)
  end

  def fit_rental_order_index_for_admin_view(rental_orders)
    rental_orders.map{
      |rental_order|
      {
        "rental_order": rental_order,
        "rental_item": rental_order.rental_item,
        "group": rental_order.group
      }
    }
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
      @rental_orders = RentalOrder.preload(:group).map{ |rental_order| rental_order if rental_order.group.fes_year_id == fes_year_id }.compact
      #rental_item_idだけ指定
    elsif fes_year_id == 0 && rental_item_id != 0
      @rental_orders = RentalOrder.where(rental_item_id: rental_item_id)
      #両方とも指定
    else
      @rental_orders = RentalOrder.where(rental_item_id: rental_item_id).map{ |rental_order| rental_order if rental_order.group.fes_year_id == fes_year_id }.compact
    end

    if @rental_orders.count == 0
      render json: fmt(not_found, [], "Not found rental_orders")
    else 
      render json: fmt(ok, fit_rental_order_index_for_admin_view(@rental_orders))
    end
  end

  #あいまい検索
  def get_search_rental_orders
    word = params[:word]
    @rental_orders = RentalOrder.preload(:group).map{ |rental_order| rental_order if rental_order.group.name.include?(word) }.compact
    if @rental_orders.count == 0
      render json: fmt(not_found, [], "Not found rental_orders")
    else
      render json: fmt(ok, fit_rental_order_index_for_admin_view(@rental_orders))
    end
  end

  def get_rental_orders_with_unassigned_num
    @rental_orders = RentalOrder.all
    
    output = []
    if(@rental_orders.length != 0)
      @rental_orders.each do |rental_order|
        unassigned_num = rental_order.num - AssignRentalItem.where(group_id: rental_order.group_id, rental_item_id: rental_order.rental_item_id).sum(:num)
        if(place_order = rental_order.group.place_order)
          if(assign_group_place = place_order.assign_group_place)
            assign_place = assign_group_place.place.name
          end
        else
          assign_place = 'not yet'
        end

        temp = {
          id: rental_order.id,
          group_name: rental_order.group.name,
          assign_place: assign_place,
          rental_item: rental_order.rental_item.name,
          num: rental_order.num,
          unassigned_num: unassigned_num,
        }
        output << temp
      end
      render json: fmt(ok, output)
    else
      render json: fmt(not_found, [], "Not found stocker_items")
    end
  end





  
end
