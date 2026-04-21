# frozen_string_literal: true

class StockerPlace < ApplicationRecord
  has_many :stocker_items, dependent: :destroy
  has_many :rentable_items, dependent: :destroy
  has_many :assign_rental_items, dependent: :destroy
  has_many :pickup_assign_rental_items, class_name: 'AssignRentalItem', foreign_key: :rental_place_id, inverse_of: :rental_place, dependent: :nullify
end
