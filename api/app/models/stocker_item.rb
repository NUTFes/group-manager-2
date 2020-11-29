class StockerItem < ApplicationRecord
    belongs_to :rental_item
    belongs_to :stocker_place
    belongs_to :fes_year
    has_one :rentable_item
end
