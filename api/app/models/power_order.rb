class PowerOrder < ApplicationRecord
    belongs_to :group

    def to_info_h
      return {
        "item": self.item,
        "power": self.power,
        "manufacturer": self.manufacturer,
        "model": self.model,
        "item_url": self.item_url
      }
    end
end
