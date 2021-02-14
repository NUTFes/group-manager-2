class StockerPlace < ApplicationRecord
    has_many :stocker_items
    has_many :rentable_items
    has_many :assign_rental_items
end
