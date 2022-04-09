class FoodProduct < ApplicationRecord
    belongs_to :group
    has_many :purchase_lists, dependent: :destroy

    def self.with_groups
      @record = FoodProduct.preload(:group)
        .map{
          |food_product|
          {
            "food_product": food_product,
            "group": food_product.group
          }
        }
    end

    def self.with_group(food_product_id)
      food_product = FoodProduct.find(food_product_id)
      {
        "food_product": food_product,
        "group": food_product.group
      }
    end

    def to_info_h
      return {
        "id": self.id,
        "name": self.name,
        "is_cooking": self.is_cooking,
        "first_day_num": self.first_day_num,
        "second_day_num": self.second_day_num
      }
    end
end
