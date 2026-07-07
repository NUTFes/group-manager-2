# frozen_string_literal: true

class Api::V1::Admin::HealthCenterSubmissionStatusesController < Api::V1::HealthCenterSubmissionStatusesApiController
  before_action :authenticate_api_user!

  def create
    upsert_health_center_submission_status
  end
end
