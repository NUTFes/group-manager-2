class PurchaseList < ApplicationRecord
    belongs_to :fes_date
    belongs_to :food_product
    belongs_to :shop

    def to_info_h
      return {
        "items": self.items,
        "is_fresh": self.is_fresh,
        "food_product": self.shop.name,
        "days_num": self.fes_date.days_num,
        "date": self.fes_date.date,
        "day": self.fes_date.day,
        "year": self.fes_date.fes_year.year_num
      }
    end
end
