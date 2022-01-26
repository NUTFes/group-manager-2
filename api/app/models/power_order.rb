class PowerOrder < ApplicationRecord
    belongs_to :group

    def self.with_group
      @record = PowerOrder.preload(:group)
        .map{
          |power_order|
          {
            "power_order": power_order,
            "group": power_order.group
          }
        }
    end

    def self.with_group_and_place_order(power_order_id)
      power_order = PowerOrder.find(power_order_id)
      return {
        power_order: power_order,
        group: power_order.group,
      }
    end

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
