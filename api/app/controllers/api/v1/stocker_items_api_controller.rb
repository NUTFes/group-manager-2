class Api::V1::StockerItemsApiController < ApplicationController

  def get_stocker_items
    # 在庫物品一覧を取得する
    stocker_items = StockerItem.all
    stocker_item_list = []
    for stocker_item in stocker_items
      item = stocker_item.rental_item.name
      stocker_place = stocker_item.stocker_place.name
      fes_year = stocker_item.fes_year.year_num
      stocker_item_list << {
        stocker_item: stocker_item,
        item: item,
        stocker_place: stocker_place,
        fes_year: fes_year
      }
    end
    render json: stocker_item_list
  end

  def get_stocker_item
    # 在庫物品の詳細を取得する
    stocker_item = StockerItem.find(params[:id])
    stocker_item_list = []
    item = stocker_item.rental_item.name
    stocker_place = stocker_item.stocker_place.name
    fes_year = stocker_item.fes_year.year_num
    stocker_item_list = {
      stocker_item: stocker_item,
      item: item,
      stocker_place: stocker_place,
      fes_year: fes_year
    }
    render json: stocker_item_list
  end

end
