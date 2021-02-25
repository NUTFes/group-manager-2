class Api::V1::PlaceAllowListsApiController < ApplicationController

  def get_place_allow_lists
    # 使用会場一覧を取得する
    place_allow_lists = PlaceAllowList.all
    pal_lists = []
    for place_allow_list in place_allow_lists
      place = place_allow_list.place.name
      group_category = place_allow_list.group_category
      pal_lists << {
        place_allow_list: place_allow_list,
        place: place,
        group_category: group_category
      }
    end
    render json: pal_lists
  end

  def get_place_allow_list
    # 使用会場の詳細を取得する
    place_allow_list = PlaceAllowList.find(params[:id])
    place = place_allow_list.place.name
    group_category = place_allow_list.group_category
    pal_list = []
    pal_list = {
      place_allow_list: place_allow_list,
      place: place,
      group_category: group_category
    }
    render json: pal_list
  end

end
