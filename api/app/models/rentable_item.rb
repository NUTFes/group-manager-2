class RentableItem < ApplicationRecord
    belongs_to :stocker_place
    belongs_to :stocker_item
end
