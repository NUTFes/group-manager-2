class PlaceAllowList < ApplicationRecord
    belongs_to :place
    belongs_to :group_category
end
