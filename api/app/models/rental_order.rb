# frozen_string_literal: true

class RentalOrder < ApplicationRecord
  belongs_to :group
  belongs_to :rental_item

  after_create :ensure_health_center_submission_status

  def self.with_groups_and_rental_item
    @record = RentalOrder.preload(:group)
      .map do |rental_order|
      {
        rental_order: rental_order,
        rental_item: rental_order.rental_item,
        group: rental_order.group
      }
    end
  end

  def self.with_rental_item(rental_order_id)
    rental_order = RentalOrder.find(rental_order_id)
    return {
      rental_order: rental_order,
      rental_item: rental_order.rental_item,
      group: rental_order.group
    }
  end

  def to_rental_item_info_h
    return {
      rental_item: nil? ? nil : self,
      name: rental_item.name,
      is_inside_shop_rentable: rental_item.is_inside_shop_rentable,
      is_outside_shop_rentable: rental_item.is_outside_shop_rentable,
      is_stage_rentable: rental_item.is_stage_rentable,
      num: num
    }
  end

  private

  def ensure_health_center_submission_status
    return unless Group.exists?(group_id)

    HealthCenterSubmissionStatus.insert_default_for_group_and_application_type!(
      group_id: group_id,
      application_type: :equipment,
      status: :unapproved
    )
  end
end
