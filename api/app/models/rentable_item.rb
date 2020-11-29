class RentableItem < ApplicationRecord
    belongs_to :stocker_place
    belongs_to :stocker_item
    has_many :assign_rental_items
end
