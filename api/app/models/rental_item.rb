# frozen_string_literal: true

class RentalItem < ApplicationRecord
  has_many :rental_item_allow_lists
  has_many :rental_orders
  has_many :stocker_items
  has_many :assign_rental_items

  def to_info_h
    {
      name: name,
      is_rentable: is_rentable
    }
  end
end
