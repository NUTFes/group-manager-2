class Api::V1::RentalItemAllowListsApiController < ApplicationController

  def get_rental_item_allow_lists
    # 使用可能物品一覧を取得する
    rental_item_allow_lists = RentalItemAllowList.all
    rental_item_allow_list = []
    for rial in rental_item_allow_lists
      item = rial.rental_item.name
      group_category = rial.group_category
      rental_item_allow_list << {
        rental_item_allow_list: rial,
        item: item,
        group_category: group_category
      }
    end
    render json: rental_item_allow_list
  end

  def get_rental_item_allow_list
    # 使用可能物品の詳細を取得する
    rial = RentalItemAllowList.find(params[:id])
    rental_item_allow_list = []
    item = rial.rental_item.name
    group_category = rial.group_category
    rental_item_allow_list = {
      rental_item_allow_list: rial,
      item: item,
      group_category: group_category
    }
    render json: rental_item_allow_list
  end

end
