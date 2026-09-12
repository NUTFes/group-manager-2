# frozen_string_literal: true

class ItemRentalLog < ApplicationRecord
  belongs_to :stocker_place
  belongs_to :rental_item
  belongs_to :group
  belongs_to :assign_rental_item, optional: true

  # NOTE: 2 (absolute_adjustment) is kept as a deprecated, read-only category so that
  # historical rows are not silently reinterpreted as rental_absolute. New records must
  # use rental_absolute/return_absolute instead (enforced by the exclusion validation below).
  enum :category, {
    rental: 0,
    return: 1,
    absolute_adjustment: 2,
    rental_absolute: 3,
    return_absolute: 4,
    addition: 5,
    reduction: 6
  }

  ASSIGNMENT_CHANGE_CATEGORIES = %w[addition reduction].freeze
  DEPRECATED_CATEGORIES = %w[absolute_adjustment].freeze

  validates :uid, presence: true, uniqueness: true
  validates :category, presence: true
  validates :category, exclusion: { in: DEPRECATED_CATEGORIES, message: 'は廃止されました' }, on: :create
  validates :quantity, presence: true, numericality: { only_integer: true, greater_than_or_equal_to: 0 }
  validates :recorder_email, presence: true
  validates :assign_rental_item, presence: true, unless: -> { category.in?(ASSIGNMENT_CHANGE_CATEGORIES) }
  validates :assign_rental_item, absence: true, if: -> { category.in?(ASSIGNMENT_CHANGE_CATEGORIES) }
end
