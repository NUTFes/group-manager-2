class Api::V1::PurchaseListsApiController < ApplicationController

  def get_purchase_lists
    # 購入品一覧を取得する
    purchase_list = PurchaseList.all
    purchase_lists = []
    for purchase in purchase_list
      food_product = purchase.food_product.name
      group = purchase.food_product.group.name
      shop = purchase.shop.name
      fes_date = purchase.fes_date
      purchase_lists << {
        purchase_list: purchase,
        food_product: food_product,
        group: group,
        shop: shop,
        fes_date: fes_date,
      }
    end
    render json: purchase_lists
  end

  def get_purchase_list
    # 購入品の詳細を取得する
    purchase_list = PurchaseList.find(params[:id])
    purchase_lists = []
    food_product = purchase_list.food_product.name
    group_id = purchase_list.food_product.group.id
    group = purchase_list.food_product.group.name
    shop = purchase_list.shop.name
    fes_date = purchase_list.fes_date
    purchase_lists = {
      purchase_list: purchase_list,
      food_product: food_product,
      group_id: group_id,
      group: group,
      shop: shop,
      fes_date: fes_date,
    }
    render json: purchase_lists
  end

end
