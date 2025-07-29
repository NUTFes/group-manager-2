# frozen_string_literal: true

class FoodProduct < ApplicationRecord
    belongs_to :group
    has_many :purchase_lists, dependent: :destroy
    has_one :cooking_process_order, dependent: :destroy

  def self.with_groups
    @record = FoodProduct.preload(:group)
                         .map do |food_product|
      {
        food_product: food_product,
        group: food_product.group
      }
    end
  end

  def self.with_group(food_product_id)
    food_product = FoodProduct.find(food_product_id)
    {
      food_product: food_product,
      group: food_product.group
    }
  end

  def to_info_h
    {
      id: id,
      name: name,
      is_cooking: is_cooking,
      first_day_num: first_day_num,
      second_day_num: second_day_num
    }
  end
end
