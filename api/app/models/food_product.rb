# frozen_string_literal: true

class FoodProduct < ApplicationRecord
  belongs_to :group
  has_many :purchase_lists, dependent: :destroy
  has_one :cooking_process_order, dependent: :destroy

  after_create :ensure_health_center_submission_status

  def self.with_groups
    @record = FoodProduct.preload(:group)
                         .map do |food_product|
      {
        food_product: food_product,
        group: food_product.group
      }
    end
  end

  def self.with_group(food_product_id)
    food_product = FoodProduct.find(food_product_id)
    {
      food_product: food_product,
      group: food_product.group
    }
  end

  def to_info_h
    return {
      id: id,
      name: name,
      is_cooking: is_cooking,
      first_day_num: first_day_num,
      second_day_num: second_day_num
    }
  end

  private

  def ensure_health_center_submission_status
    return unless Group.exists?(group_id)

    HealthCenterSubmissionStatus.insert_default_for_group_and_application_type!(
      group_id: group_id,
      application_type: :food_product,
      status: :unsubmitted
    )
  end
end
