# frozen_string_literal: true

class RentalItem < ApplicationRecord
  has_many :rental_item_allow_lists, dependent: :destroy
  has_many :rental_orders, dependent: :destroy
  has_many :stocker_items, dependent: :destroy
  has_many :assign_rental_items, dependent: :destroy

  def to_info_h
    return {
      name: name,
      is_rentable: is_rentable
    }
  end
end
