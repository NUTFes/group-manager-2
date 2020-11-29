class StockerItem < ApplicationRecord
    belongs_to :rental_item
    belongs_to :stocker_place
    belongs_to :fes_year
end
