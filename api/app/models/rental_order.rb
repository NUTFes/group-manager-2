class RentalOrder < ApplicationRecord
    belongs_to :group
    belongs_to :rental_item
end
