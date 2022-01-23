class Place < ApplicationRecord
    has_many :assign_group_places
    has_many :place_allow_lists
    has_many :place_numbers

    def to_name
      return self.name
    end

    # その会場の参加団体を取得する
    def groups
      return self.place_numbers.preload(:group_identification).map{ |place_number| place_number.group_identification.group }
    end
end
