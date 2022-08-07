class Api::V1::AssignRentalItemsApiController < ApplicationController

    #在庫物品 stocker_items
    def get_stocker_item_index_for_admin_view
        @stocker_items = StockerItem.with_rental_items
        render json: fmt(ok, @stocker_items)
    end

    def get_stocker_item_show_for_admin_view
        @stocker_item = StockerItem.with_rental_item(params[:id])
        render json: fmt(ok, @stocker_item)
    end

    def fit_stocker_item_index_for_admin_view(stocker_items)
        stocker_items.map{
          |stocker_item|
          {
            "stocker_item": stocker_item,
            "rental_item": stocker_item.rental_item,
          }
        }
    end
    
    #在庫物品絞り込み
    def get_refinement_stocker_item
        stocker_place_id = params[:stocker_place_id].to_i
        if stocker_place_id == 0
            @stocker_items = StockerItem.all
        else
            @stocker_items = StockerItem.where(stocker_place_id: stocker_place_id)
        end

				@stocker_place = StockerPlace.find(params[:stocker_place_id])
    
        if @stocker_items.count == 0
            render json: fmt(not_found, { "stocker_place": @stocker_place, "stocker_items": [] }, "Not found stocker_items")
        else
            render json: fmt(ok, { "stocker_place": @stocker_place, "stocker_items": fit_stocker_item_index_for_admin_view(@stocker_items) })
        end
    end

    #割当状況 assign_rental_items
    def get_assign_rental_item_index_for_admin_view
        @assign_rental_items = AssignRentalItem.with_groups_and_rental_item
        render json: fmt(ok, @assign_rental_items)
    end

    def get_assign_rental_item_show_for_admin_view
        @assign_rental_item = AssignRentalItem.with_rental_item(params[:id])
        render json: fmt(ok, @assign_rental_item)
    end

    def fit_assign_rental_item_index_for_admin_view(assign_rental_items)
        assign_rental_items.map{
          |assign_rental_item|
          {
            "assign_rental_item": assign_rental_item,
            "rental_item": assign_rental_item.rental_item,
            "group": assign_rental_item.group,
          }
        }
    end

    #割当状況絞り込み
    def get_refinement_assign_rental_item
        stocker_place_id = params[:stocker_place_id].to_i
        if stocker_place_id == 0
            @assign_rental_items = AssignRentalItem.all
        else
            @assign_rental_items = AssignRentalItem.where(stocker_place_id: stocker_place_id)
        end

        if @assign_rental_items.count == 0
            render json: fmt(not_found, [], "Not found assign_rental_items")
        else
            render json: fmt(ok, fit_assign_rental_item_index_for_admin_view(@assign_rental_items))
        end
    end
end
