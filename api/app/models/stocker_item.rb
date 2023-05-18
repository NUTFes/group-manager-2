class StockerItem < ApplicationRecord
    belongs_to :rental_item
    belongs_to :stocker_place
    belongs_to :fes_year
    has_one :rentable_item
    
    def self.with_rental_items
        @record = StockerItem.preload(:rental_item)
          .map{
            |stocker_item|
            {
              "stocker_item": stocker_item,
              "rental_item": stocker_item.rental_item,
            }
          }
    end
  
    def self.with_rental_item(stocker_item_id)
        stocker_item = StockerItem.find(stocker_item_id)
        return {
            "stocker_item": stocker_item,
            "rental_item": stocker_item.rental_item,
        }
    end

    def to_rental_item_info_h
        return {
          "rental_item": self.nil? ? nil : self,
          "name": self.rental_item.name,
          "is_inside_shop_rentable": self.rental_item.is_inside_shop_rentable,
          "is_outside_shop_rentable": self.rental_item.is_outside_shop_rentable,
          "is_stage_rentable": self.rental_item.is_stage_rentable,
          "num": self.num
        }
    end
end
