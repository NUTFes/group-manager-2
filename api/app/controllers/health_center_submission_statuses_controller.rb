# frozen_string_literal: true

class HealthCenterSubmissionStatusesController < ApplicationController
  before_action :set_health_center_submission_status, only: %i[show update destroy]

  # GET /health_center_submission_statuses
  def index
    statuses = HealthCenterSubmissionStatus.order(:group_id, :application_type)
    render json: fmt(ok, statuses), status: :ok
  end

  # GET /health_center_submission_statuses/1
  def show
    render json: fmt(ok, @health_center_submission_status), status: :ok
  end

  # POST /health_center_submission_statuses
  def create
    health_center_submission_status = HealthCenterSubmissionStatus.new(health_center_submission_status_params)

    if health_center_submission_status.save
      render json: fmt(created, health_center_submission_status), status: :created
    else
      render json: fmt(unprocessable_entity, [], health_center_submission_status.errors.full_messages.join(', ')),
             status: :unprocessable_entity
    end
  rescue ArgumentError => e
    render json: fmt(unprocessable_entity, [], e.message), status: :unprocessable_entity
  end

  # PATCH/PUT /health_center_submission_statuses/1
  def update
    if @health_center_submission_status.update(health_center_submission_status_params)
      render json: fmt(ok, @health_center_submission_status,
                       "Updated health_center_submission_status id = #{params[:id]}"), status: :ok
    else
      render json: fmt(unprocessable_entity, [], @health_center_submission_status.errors.full_messages.join(', ')),
             status: :unprocessable_entity
    end
  rescue ArgumentError => e
    render json: fmt(unprocessable_entity, [], e.message), status: :unprocessable_entity
  end

  # DELETE /health_center_submission_statuses/1
  def destroy
    @health_center_submission_status.destroy
    render json: fmt(ok, [], "Deleted health_center_submission_status = #{params[:id]}"), status: :ok
  end

  # GET /health_center_submission_statuses/group/:group_id
  def get_by_group_id
    statuses = HealthCenterSubmissionStatus.where(group_id: params[:group_id]).order(:application_type)

    if statuses.exists?
      render json: fmt(ok, statuses), status: :ok
    else
      render json: fmt(not_found, [], "Not found health_center_submission_statuses for group_id = #{params[:group_id]}"),
             status: :not_found
    end
  end

  private

  def set_health_center_submission_status
    @health_center_submission_status = HealthCenterSubmissionStatus.find_by(id: params[:id])
    return if @health_center_submission_status

    render json: fmt(not_found, [], "Not found health_center_submission_status id = #{params[:id]}"), status: :not_found
  end

  def health_center_submission_status_params
    source = params[:health_center_submission_status] || params
    ActionController::Parameters.new(source.to_unsafe_h).permit(:group_id, :application_type, :status)
  end
end
