class GroupCategory < ApplicationRecord
    has_many :groups
    has_many :place_allow_lists
    has_many :rental_item_allow_lists
end
