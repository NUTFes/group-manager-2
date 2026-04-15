# frozen_string_literal: true

class HealthCenterSubmissionStatus < ApplicationRecord
  belongs_to :group
  has_many :comments, as: :commentable, dependent: :destroy

  enum application_type: {
    food_product: 0,
    purchase_list: 1,
    cooking_process_order: 2,
    employee: 3,
    venue_map: 4,
    equipment: 5
  }

  enum status: {
    unapproved: 0,
    waiting_resubmission: 1,
    approved: 2,
    unsubmitted: 3
  }

  validates :application_type, presence: true, uniqueness: { scope: :group_id }
  validates :status, presence: true
end
