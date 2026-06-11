# frozen_string_literal: true

class HealthCenterSubmissionStatus < ApplicationRecord
  belongs_to :group
  has_many :comments, as: :commentable, dependent: :destroy

  DEFAULT_STATUS = 'unsubmitted'

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

  def self.ensure_for_group_and_application_type!(group_id:, application_type:, status: DEFAULT_STATUS)
    submission_status = find_or_initialize_by(group_id: group_id, application_type: application_type)
    submission_status.status = status
    submission_status.save!
    submission_status
  end

  def self.insert_default_for_group_and_application_type!(group_id:, application_type:, status: DEFAULT_STATUS)
    find_or_create_by!(group_id: group_id, application_type: application_type) do |submission_status|
      submission_status.status = status
    end
  end

  def self.default_submissions_for(group)
    statuses = group.health_center_submission_statuses.includes(:comments).index_by(&:application_type)

    application_types.keys.map do |application_type|
      submission_status = statuses[application_type]

      {
        id: submission_status&.id,
        application_type: application_type,
        status: submission_status&.status || DEFAULT_STATUS,
        comments: submission_status&.comments || [],
        detail: nil
      }
    end
  end
end
