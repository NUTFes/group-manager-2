class FesDate < ApplicationRecord
    belongs_to :fes_year
    has_many :stage_orders
    has_many :purchase_lists
end
