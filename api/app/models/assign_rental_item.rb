class AssignRentalItem < ApplicationRecord
    belongs_to :group
    belongs_to :rental_item
    belongs_to :stocker_place
end
