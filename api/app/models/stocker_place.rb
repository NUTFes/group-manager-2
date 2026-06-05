# frozen_string_literal: true

class StockerPlace < ApplicationRecord
  has_many :stocker_items, dependent: :destroy
  has_many :rentable_items, dependent: :destroy
  has_many :assign_rental_items, foreign_key: :stocker_place_id, dependent: :destroy
end
