class Place < ApplicationRecord
    has_many :assign_group_places
    has_many :place_allow_lists

    def to_name
      return self.name
    end
end
