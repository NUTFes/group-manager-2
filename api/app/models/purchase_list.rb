# frozen_string_literal: true

class PurchaseList < ApplicationRecord
  belongs_to :fes_date
  belongs_to :food_product
  belongs_to :shop

  after_create :ensure_health_center_submission_status

  def self.with_groups_and_info
    @record = PurchaseList.preload(:food_product)
                          .map do |purchase_list|
      {
        purchase_list: purchase_list,
        purchase_list_info: purchase_list.to_info_h,
        group: purchase_list.food_product.group
      }
    end
  end

  def self.with_group_and_info(purchase_list_id)
    purchase_list = PurchaseList.find(purchase_list_id)
    {
      purchase_list: purchase_list,
      purchase_list_info: purchase_list.to_info_h,
      group: purchase_list.food_product.group
    }
  end

  def to_info_h
    return {
      id: id,
      items: items,
      is_fresh: is_fresh,
      food_product: food_product.name,
      food_product_id: food_product.id,
      shop: shop.name,
      shop_id: shop.id,
      days_num: fes_date.days_num,
      date: fes_date.date,
      date_id: fes_date.id,
      day: fes_date.day,
      year: fes_date.fes_year.year_num,
      purchase_date: purchase_date,
      url: url
    }
  end

  private

  def ensure_health_center_submission_status
    return unless food_product&.group_id

    HealthCenterSubmissionStatus.ensure_for_group_and_application_type!(
      group_id: food_product.group_id,
      application_type: :purchase_list,
      status: :unapproved
    )
  end
end
