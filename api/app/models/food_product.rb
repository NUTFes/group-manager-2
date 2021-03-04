class FoodProduct < ApplicationRecord
    belongs_to :group
    has_many :purchase_lists, dependent: :destroy
end
