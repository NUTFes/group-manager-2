class Api::V1::ItemsApiController < ApplicationController

  def get_stocker_item_for_stocker_place
    # 在庫場所から在庫物品をすべて取得する
    items = StockerItem.where(stocker_place_id: params[:id])
    stocker_items = []
    for item in items
      rental_item = item.rental_item.name
      rental_item_num = item.num
      stocker_items << {
        id: item.id,
        item: rental_item,
        num: rental_item_num,
      }
    end
    render json: stocker_items
  end

  def get_item_name
    # 物品のidと名前の一覧
    items = RentalItem.all
    item_name = []
    for item in items
      name = item.name
      item_name << {
        id: item.id,
        name: item.name,
      }
    end
    render json: item_name
  end

  def get_assign_rental_item_for_stocker_place
    assign_items = AssignRentalItem.where(stocker_place_id: params[:stocker_place_id])
    item_list = []
    for item in assign_items
      item_list << {
        id: item.id,
        group: item.group.name,
        item: item.rental_item.name,
        num: item.num
      }
    end
    render json: item_list
  end

end
