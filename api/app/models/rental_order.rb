class RentalOrder < ApplicationRecord
    belongs_to :group
    belongs_to :rental_item

    def to_rental_item_info_h
      return {
        "name": self.rental_item.name,
        "is_rentable": self.rental_item.is_rentable,
        "num": self.num
      }
    end
end
