# frozen_string_literal: true

class UnRegisteredGroup < ApplicationRecord
  belongs_to :group

  enum :order_type, {
    rental_item_order: 0,
    power_order: 1,
    sub_rep: 2,
    employee: 3,
    fire_equipment_order: 4
  }
end
