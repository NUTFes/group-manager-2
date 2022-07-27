class Api::V1::AssignRentalItemsApiController < ApplicationController

    #物品割当絞り込み
    def get_refinement_stocker_item
        stocker_place_id = params[:stocker_place_id].to_i
        if stocker_place_id == 0
            @stocker_items = StockerItem.all
        else
            @stocker_items = StockerItem.where(stocker_place_id: stocker_place_id)
        end
    
        if @stocker_items.count == 0
            render json: fmt(not_found, [], "Not found stocker_items")
        else
            render json: fmt(ok, @stocker_items)
        end
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
            render json: fmt(ok, @assign_rental_items)
        end
    end

end
