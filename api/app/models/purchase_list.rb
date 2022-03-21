class PurchaseList < ApplicationRecord
    belongs_to :fes_date
    belongs_to :food_product
    belongs_to :shop

    def self.with_groups_and_info
      @record = PurchaseList.preload(:food_product)
        .map{
          |purchase_list|
          {
            "purchase_list": purchase_list,
            "purchase_list_info": purchase_list.to_info_h,
            "group": purchase_list.food_product.group
          }
        }
    end

    def self.with_group_and_info(purchase_list_id)
      purchase_list = PurchaseList.find(purchase_list_id)
      {
        "purchase_list": purchase_list,
        "purchase_list_info": purchase_list.to_info_h,
        "group": purchase_list.food_product.group
      }
    end

    def to_info_h
      return {
        "items": self.items,
        "is_fresh": self.is_fresh,
        "food_product": self.food_product.name,
        "shop": self.shop.name,
        "days_num": self.fes_date.days_num,
        "date": self.fes_date.date,
        "day": self.fes_date.day,
        "year": self.fes_date.fes_year.year_num
      }
    end
end
