class AssignRentalItem < ApplicationRecord
    belongs_to :rental_order
    belongs_to :rentable_item
end
