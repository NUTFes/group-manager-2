require 'rails_helper'

RSpec.describe FireEquipmentOrder, type: :model do
  describe '#fuel_japanese' do
    it 'returns Japanese translation for gas_bottle' do
      order = build(:fire_equipment_order, fuel: 'gas_bottle')
      expect(order.fuel_japanese).to eq('ガスボンベ')
    end

    it 'returns Japanese translation for lp_gas' do
      order = build(:fire_equipment_order, fuel: 'lp_gas')
      expect(order.fuel_japanese).to eq('LPガス')
    end

    it 'returns Japanese translation for charcoal' do
      order = build(:fire_equipment_order, fuel: 'charcoal')
      expect(order.fuel_japanese).to eq('炭')
    end

    it 'returns original value for unknown fuel' do
      order = build(:fire_equipment_order, fuel: 'unknown')
      expect(order.fuel_japanese).to eq('unknown')
    end
  end

  describe '.fuel_options_for_select' do
    it 'returns array of [Japanese name, English key] pairs' do
      options = FireEquipmentOrder.fuel_options_for_select
      expect(options).to contain_exactly(
        ['ガスボンベ', 'gas_bottle'],
        ['LPガス', 'lp_gas'],
        ['炭', 'charcoal']
      )
    end
  end
end
