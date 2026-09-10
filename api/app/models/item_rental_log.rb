# frozen_string_literal: true

class ItemRentalLog < ApplicationRecord
  belongs_to :stocker_place
  belongs_to :rental_item
  belongs_to :group
  belongs_to :assign_rental_item, optional: true

  enum :category, {
    rental: 0,
    return: 1,
    rental_absolute: 2,
    return_absolute: 3,
    addition: 4,
    reduction: 5
  }

  ASSIGNMENT_CHANGE_CATEGORIES = %w[addition reduction].freeze

  validates :uid, presence: true, uniqueness: true
  validates :category, presence: true
  validates :quantity, presence: true, numericality: { only_integer: true, greater_than_or_equal_to: 0 }
  validates :recorder_email, presence: true
  validates :assign_rental_item, presence: true, unless: -> { category.in?(ASSIGNMENT_CHANGE_CATEGORIES) }
  validates :assign_rental_item, absence: true, if: -> { category.in?(ASSIGNMENT_CHANGE_CATEGORIES) }
end
