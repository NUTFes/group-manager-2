# frozen_string_literal: true

class CookingProcessOrder < ApplicationRecord
  # group_id という名前の外部キーを持つ group への belongs_to 関連
  belongs_to :group
  belongs_to :food_product

  # 全ての CookingProcessOrder レコードとそれらの group をプリロードしてハッシュで返すクラスメソッド
  def self.with_groups
    @records = CookingProcessOrder.preload(:group)
                                  .map do |cooking_process_order|
      {
        cooking_process_order: cooking_process_order,
        group: cooking_process_order.group
      }
    end
  end

  # 特定の CookingProcessOrder レコードとその group を返すクラスメソッド
  def self.with_group(cooking_process_order_id)
    cooking_process_order = CookingProcessOrder.find(cooking_process_order_id)
    {
      cooking_process_order: cooking_process_order,
      group: cooking_process_order.group
    }
  end

  # food_product_id を受け取り、関連する調理工程、団体、販売品情報をハッシュで返す
  def self.with_group_by_food_product_id(food_product_id)
    food_product = FoodProduct.find_by(id: food_product_id)
    return nil unless food_product

    cooking_process_order = food_product.cooking_process_order
    {
      cooking_process_order: cooking_process_order,
      group: food_product.group,
      food_product: food_product
    }
  end

  # インスタンスの情報をハッシュとして返すインスタンスメソッド
  def to_info_h
    {
      id: id,
      group_id: group_id,
      pre_open_kitchen: pre_open_kitchen,
      during_open_kitchen: during_open_kitchen,
      tent: tent,
      tent_ja: tent_ja,
      tent_source_hash: tent_source_hash
    }
  end

  def tent_for_submission
    tent_ja.presence || tent
  end
end
