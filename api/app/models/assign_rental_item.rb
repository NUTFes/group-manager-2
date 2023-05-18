class AssignRentalItem < ApplicationRecord
    belongs_to :group
    belongs_to :rental_item
    belongs_to :stocker_place

    def self.with_groups_and_rental_item
        @record = AssignRentalItem.preload(:group)
          .map{
            |assign_rental_item|
            {
              "assign_rental_item": assign_rental_item,
              "rental_item": assign_rental_item.rental_item,
              "group": assign_rental_item.group
            }
          }
    end
  
    def self.with_rental_item(assign_rental_item_id)
        assign_rental_item = AssignRentalItem.find(assign_rental_item_id)
        return {
            "assign_rental_item": assign_rental_item,
            "rental_item": assign_rental_item.rental_item,
            "group": assign_rental_item.group
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
