# frozen_string_literal: true

class Api::V1::HealthCenterSubmissionStatusesController < Api::V1::HealthCenterSubmissionStatusesApiController
  def create
    upsert_health_center_submission_status
  end
end
