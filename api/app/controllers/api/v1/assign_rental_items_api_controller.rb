class Api::V1::AssignRentalItemsApiController < ApplicationController

  def get_assign_rental_items
    # 割り当て物品一覧を取得する
    assign_rental_items = AssignRentalItem.all
    assign_rental_item_list = []
    for assign_rental_item in assign_rental_items
      group = assign_rental_item.group.name
      item = assign_rental_item.rental_item.name
      stocker_place = assign_rental_item.stocker_place.name
      assign_rental_item_list << {
        assign_rental_item: assign_rental_item,
        group: group,
        item: item,
        stocker_place: stocker_place,
      }
    end
    render json: assign_rental_item_list
  end

  def get_assign_rental_item
    # 割り当て物品の詳細を取得する
    assign_rental_item = AssignRentalItem.find(params[:id])
    assign_rental_item_list = []
    group = assign_rental_item.group.name
    item = assign_rental_item.rental_item.name
    stocker_place = assign_rental_item.stocker_place.name
    assign_rental_item_list = {
      assign_rental_item: assign_rental_item,
      group: group,
      item: item,
      stocker_place: stocker_place,
    }
    render json: assign_rental_item_list
  end

end
