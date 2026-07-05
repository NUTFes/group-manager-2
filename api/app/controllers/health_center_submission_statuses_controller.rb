# frozen_string_literal: true

class HealthCenterSubmissionStatusesController < ApplicationController
  before_action :authenticate_api_user!
  before_action :require_group_id, only: %i[user_index]

  # user画面用の申請ステータス取得
  def user_index
    group = current_user_group(params[:group_id])
    return render_user_not_found unless group

    render json: fmt(ok, {
                       submissions: HealthCenterSubmissionStatus.default_submissions_for(group)
                     })
  end

  # user画面用ステータス変更
  def user_update
    return render_invalid_user_status unless valid_user_status?(params[:status].to_s)

    submission_status = current_user_submission_status(params[:id])
    return render_user_not_found unless submission_status

    save_submission_status(submission_status)
  end

  # user画面用ステータス初回作成（未作成分をINSERT）
  def user_create
    return render json: fmt(unprocessable_entity, [], 'Invalid application_type') unless valid_application_type?(params[:application_type].to_s)
    return render_invalid_user_status unless valid_user_status?(params[:status].to_s)

    group = current_user_group(params[:group_id])
    return render_user_not_found unless group

    submission_status = HealthCenterSubmissionStatus.find_or_initialize_by(
      group_id: group.id,
      application_type: params[:application_type]
    )

    save_submission_status(submission_status)
  end

  private

  def save_submission_status(submission_status)
    return render json: fmt(unprocessable_entity, [], 'Invalid status') unless HealthCenterSubmissionStatus.statuses.key?(params[:status].to_s)

    submission_status.status = params[:status]

    if submission_status.save
      render json: fmt(ok, {
                         id: submission_status.id,
                         group_id: submission_status.group_id,
                         application_type: submission_status.application_type,
                         status: submission_status.status
                       })
    else
      render json: fmt(unprocessable_entity, [], submission_status.errors.full_messages.join(', '))
    end
  end

  def valid_application_type?(application_type)
    HealthCenterSubmissionStatus.application_types.key?(application_type)
  end

  def valid_user_status?(status)
    status == 'unapproved'
  end

  def current_user_group(group_id)
    return nil if group_id.blank?

    current_api_user.groups.find_by(id: group_id)
  end

  def current_user_submission_status(id)
    HealthCenterSubmissionStatus
      .joins(:group)
      .where(groups: { user_id: current_api_user.id })
      .find_by(id: id)
  end

  def render_user_not_found
    render json: fmt(not_found, [], 'health_center_submission_status not found'), status: :not_found
  end

  def render_invalid_user_status
    render json: fmt(unprocessable_entity, [], 'Invalid status'), status: :unprocessable_entity
  end

  def require_group_id
    return render json: fmt(unprocessable_entity, [], 'group_id is required') if params[:group_id].blank?
  end
end
