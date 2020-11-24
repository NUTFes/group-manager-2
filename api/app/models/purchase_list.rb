class PurchaseList < ApplicationRecord
    belongs_to :fes_date
    belongs_to :food_product
    belongs_to :shop
end
