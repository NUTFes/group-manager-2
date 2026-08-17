# frozen_string_literal: true

class ItemRentalLog < ApplicationRecord
  belongs_to :stocker_place
  belongs_to :rental_item

  enum :category, {
    rental: 0,
    return: 1,
    absolute_adjustment: 2
  }

  validates :uid, presence: true, uniqueness: true
  validates :category, presence: true
  validates :quantity, presence: true
  validates :recorder_email, presence: true
end
