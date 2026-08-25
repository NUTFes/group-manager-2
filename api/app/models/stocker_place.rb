# frozen_string_literal: true

class StockerPlace < ApplicationRecord
  has_many :stocker_items, dependent: :destroy
  has_many :rentable_items, dependent: :destroy
  has_many :assign_rental_items, dependent: :destroy
  has_many :assign_group_places, dependent: :destroy
  belongs_to :place_category, optional: true

  validate :place_category_id_must_be_nil_or_integer

  private

  def place_category_id_must_be_nil_or_integer
    return unless place_category_id_before_type_cast == ''

    errors.add(:place_category_id, 'must be nil or integer')
  end
end
