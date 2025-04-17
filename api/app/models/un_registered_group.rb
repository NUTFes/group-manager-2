class UnRegisteredGroup < ApplicationRecord
  belongs_to :group

  enum order_type: {
    place_order: 0,
    power_order: 1,
    sub_rep: 2,
    public_relation: 3,
    employee: 4
  }
end
