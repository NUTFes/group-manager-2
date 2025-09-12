class RentalItem < ApplicationRecord
    has_many :rental_item_allow_lists, dependent: :destroy
    has_many :rental_orders, dependent: :destroy
    has_many :stocker_items, dependent: :destroy
    has_many :assign_rental_items, dependent: :destroy

    def to_info_h
      return {
        "name": self.name,
        "is_rentable": self.is_rentable
      }
    end
end
