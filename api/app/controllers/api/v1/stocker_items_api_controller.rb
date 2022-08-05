class Api::V1::StockerItemsApiController < ApplicationController
    def get_stocker_items_with_remaining_num
      rental_item_id = params[:rental_item_id].to_i
      stocker_place_id = params[:stocker_place_id].to_i
      
      # 両方ともALL
      if rental_item_id == 0 && stocker_place_id == 0
        @stocker_items = StockerItem.all
  
      # rental_item_idだけ指定
      elsif rental_item_id != 0 && stocker_place_id == 0
        @stocker_items = StockerItem.where(rental_item_id: rental_item_id)
      
      # stocker_place_idだけ指定
      elsif rental_item_id == 0 && stocker_place_id != 0
        @stocker_items = StockerItem.where(stocker_place_id: stocker_place_id)
  
      # 両方とも指定
      elsif rental_item_id != 0 && stocker_place_id != 0
        @stocker_items = StockerItem.where(rental_item_id: rental_item_id, stocker_place_id: stocker_place_id)
      end
  
      output = []
      if(@stocker_items.length != 0)
        @stocker_items.each do |stocker_item|
          remaining_num = stocker_item.num - AssignRentalItem.where( rental_item_id: stocker_item.rental_item_id, stocker_place_id: stocker_item.stocker_place_id).sum(:num)
          temp = {
            id: stocker_item.id,
            fes_year_id: stocker_item.fes_year_id,
            rental_item: stocker_item.rental_item.name,
            stocker_place: stocker_item.stocker_place.name,
            num: stocker_item.num,
            remaining_num: remaining_num,
          }
          output << temp
        end
        render json: fmt(ok, output)
      else
        render json: fmt(not_found, [], "Not found stocker_items")
      end
    end
  
end