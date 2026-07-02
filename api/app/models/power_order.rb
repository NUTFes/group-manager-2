# frozen_string_literal: true

class PowerOrder < ApplicationRecord
  belongs_to :group

  after_create :ensure_health_center_submission_status

  def self.with_groups
    @record = PowerOrder.preload(:group)
                        .map do |power_order|
      {
        power_order: power_order,
        group: power_order.group
      }
    end
  end

  def self.with_group_and_place_order(power_order_id)
    power_order = PowerOrder.find(power_order_id)
    return {
      power_order: power_order,
      group: power_order.group
    }
  end

  def to_info_h
    return {
      id: id,
      item: item,
      power: power,
      manufacturer: manufacturer,
      model: model,
      item_url: item_url
    }
  end

  private

  def ensure_health_center_submission_status
    HealthCenterSubmissionStatus.insert_default_for_group_and_application_type!(
      group_id: group_id,
      application_type: :power_order
    )
  end
end
