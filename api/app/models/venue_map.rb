# frozen_string_literal: true

class VenueMap < ApplicationRecord
  belongs_to :group

  after_create :ensure_health_center_submission_status

  def to_info_h
    {
      id: id,
      group_id: group_id,
      picture_name: picture_name,
      picture_path: picture_path,
      created_at: created_at,
      updated_at: updated_at
    }
  end

  private

  def ensure_health_center_submission_status
    HealthCenterSubmissionStatus.insert_default_for_group_and_application_type!(
      group_id: group_id,
      application_type: :venue_map,
      status: :unapproved
    )
  end
end
