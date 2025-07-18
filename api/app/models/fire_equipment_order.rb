class FireEquipmentOrder < ApplicationRecord
  include FuelTranslatable

  belongs_to :group
  # enum gas_bottle: ガスボンベ、lp_gas: LPガス、charcoal: 炭
  enum fuel: { gas_bottle: 1, lp_gas: 2, charcoal: 3 }
end
