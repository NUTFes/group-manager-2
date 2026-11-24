# frozen_string_literal: true

class Api::V1::HealthCenterSubmissionStatusesController < Api::V1::HealthCenterSubmissionStatusesApiController
  # 親controllerの判定は、ここで宣言し直したauthenticate_api_user!より先に並ぶため、
  # 認証の後に実行されるようロール判定も宣言し直す
  before_action :authenticate_api_user!
  before_action :require_staff!
  # 管理画面の書き込み系のみのため、manager
  before_action :require_manager!

  def create
    upsert_health_center_submission_status
  end
end
