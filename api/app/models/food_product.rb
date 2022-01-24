class FoodProduct < ApplicationRecord
    belongs_to :group
    has_many :purchase_lists, dependent: :destroy

    def to_info_h
      return {
        "name": self.name,
        "is_cooking": self.is_cooking,
        "first_day_num": self.first_day_num,
        "second_day_num": self.second_day_num
      }
    end
end
