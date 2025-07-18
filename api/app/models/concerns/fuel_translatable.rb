module FuelTranslatable
  extend ActiveSupport::Concern

  FUEL_TRANSLATIONS = {
    'gas_bottle' => 'ガスボンベ',
    'lp_gas' => 'LPガス',
    'charcoal' => '炭'
  }.freeze

  def fuel_japanese
    FUEL_TRANSLATIONS[self.fuel] || self.fuel.to_s
  end

  class_methods do
    def fuel_options_for_select
      FUEL_TRANSLATIONS.map { |key, value| [value, key] }
    end
  end
end
