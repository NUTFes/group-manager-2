class FesYear < ApplicationRecord
    has_many :groups
    has_many :fes_dates
    has_many :stocker_items
end
