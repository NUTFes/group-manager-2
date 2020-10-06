class Place < ApplicationRecord
    has_many :assign_group_places
    has_many :place_allow_lists
end
