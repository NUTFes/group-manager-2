class RentalItemAllowList < ApplicationRecord
    belongs_to :group_category
    belongs_to :rental_item
end
