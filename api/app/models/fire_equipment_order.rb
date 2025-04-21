class FireEquipmentOrder < ApplicationRecord
  # enum gas_bottle: ガスボンベ、lp_gas: LPガス、charcoal: 炭
  enum fuel: { gas_bottle: 0, lp_gas: 1, charcoal: 2 }
end
