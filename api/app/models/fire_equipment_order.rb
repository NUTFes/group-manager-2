# frozen_string_literal: true

class FireEquipmentOrder < ApplicationRecord
  belongs_to :group

  after_create :ensure_health_center_submission_status
  # enum gas_bottle: ガスボンベ、lp_gas: LPガス、charcoal: 炭
  enum fuel: { gas_bottle: 1, lp_gas: 2, charcoal: 3 }

  FUEL_TRANSLATIONS = {
    'gas_bottle' => 'ガスボンベ',
    'lp_gas' => 'LPガス',
    'charcoal' => '炭'
  }.freeze

  def fuel_japanese
    FUEL_TRANSLATIONS[fuel] || fuel.to_s
  end

  def self.fuel_options_for_select
    FUEL_TRANSLATIONS.map { |key, value| [value, key] }
  end

  def to_info_h
    {
      id: id,
      group_id: group_id,
      name: name,
      quantity: quantity,
      fuel: fuel,
      fuel_japanese: fuel_japanese,
      usage: usage,
      is_takeaway: is_takeaway,
      remark: remark
    }
  end

  private

  def ensure_health_center_submission_status
    HealthCenterSubmissionStatus.insert_default_for_group_and_application_type!(
      group_id: group_id,
      application_type: :fire_equipment_order
    )
  end
end
