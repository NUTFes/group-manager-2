class RentalOrder < ApplicationRecord
    belongs_to :group
    belongs_to :rental_item
    has_one :assign_rental_item
end
