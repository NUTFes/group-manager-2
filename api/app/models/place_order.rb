class PlaceOrder < ApplicationRecord
    belongs_to :group
    has_one :assign_group_place, dependent: :destroy

    # 会場申請を会場名のハッシュにして返す
    def to_place_name_h
      @places = Place.all
      return { 
        "first": @places[self.first-1].name,
        "second": @places[self.second-1].name,
        "third": @places[self.third-1].name
      }
    end
end
