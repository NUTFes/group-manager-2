class PlaceOrder < ApplicationRecord
    belongs_to :group
    has_one :assign_group_place, dependent: :destroy
end
