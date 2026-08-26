# frozen_string_literal: true

class AssignRentalItem < ApplicationRecord
  belongs_to :group
  belongs_to :rental_item
  belongs_to :stocker_place, class_name: 'StockerPlace', optional: true
  belongs_to :rental_place, class_name: 'StockerPlace', optional: true

  validates :rental_place, presence: true, if: -> { rental_place_id.present? }

  # 在庫場所名（物品が保管されている場所）。未設定の場合は空文字
  def stock_place_name(locale: :ja)
    stocker_place&.display_name(locale: locale).to_s
  end

  # 貸出場所名（当日の受け渡し場所）。貸出場所調整で未設定の場合は空文字
  def rental_place_name(locale: :ja)
    rental_place&.display_name(locale: locale).to_s
  end

  def self.with_groups_and_rental_item
    @record = AssignRentalItem.preload(:group)
                              .map do |assign_rental_item|
      {
        assign_rental_item: assign_rental_item,
        rental_item: assign_rental_item.rental_item,
        group: assign_rental_item.group
      }
    end
  end

  def self.with_rental_item(assign_rental_item_id)
    assign_rental_item = AssignRentalItem.find(assign_rental_item_id)
    return {
      assign_rental_item: assign_rental_item,
      rental_item: assign_rental_item.rental_item,
      group: assign_rental_item.group
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
end
