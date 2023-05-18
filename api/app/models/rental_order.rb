class RentalOrder < ApplicationRecord
    belongs_to :group
    belongs_to :rental_item

    def self.with_groups_and_rental_item
      @record = RentalOrder.preload(:group)
        .map{
          |rental_order|
          {
            "rental_order": rental_order,
            "rental_item": rental_order.rental_item,
            "group": rental_order.group
          }
        }
    end

    def self.with_rental_item(rental_order_id)
      rental_order = RentalOrder.find(rental_order_id)
      return {
        "rental_order": rental_order,
        "rental_item": rental_order.rental_item,
        "group": rental_order.group
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
