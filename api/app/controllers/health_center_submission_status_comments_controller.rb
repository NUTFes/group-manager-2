# frozen_string_literal: true

class HealthCenterSubmissionStatusCommentsController < ApplicationController
  before_action :set_health_center_submission_status
  before_action :set_comment, only: %i[show update destroy]

  # GET /health_center_submission_statuses/:health_center_submission_status_id/comments
  def index
    comments = @health_center_submission_status.comments.order(:created_at)
    render json: fmt(ok, comments), status: :ok
  end

  # GET /health_center_submission_statuses/:health_center_submission_status_id/comments/:id
  def show
    render json: fmt(ok, @comment), status: :ok
  end

  # POST /health_center_submission_statuses/:health_center_submission_status_id/comments
  def create
    comment = @health_center_submission_status.comments.build(comment_params)

    if comment.save
      render json: fmt(created, comment), status: :created
    else
      render json: fmt(unprocessable_entity, [], comment.errors.full_messages.join(', ')), status: :unprocessable_entity
    end
  end

  # PATCH/PUT /health_center_submission_statuses/:health_center_submission_status_id/comments/:id
  def update
    if @comment.update(comment_params)
      render json: fmt(ok, @comment, "Updated comment id = #{params[:id]}"), status: :ok
    else
      render json: fmt(unprocessable_entity, [], @comment.errors.full_messages.join(', ')), status: :unprocessable_entity
    end
  end

  # DELETE /health_center_submission_statuses/:health_center_submission_status_id/comments/:id
  def destroy
    @comment.destroy
    render json: fmt(ok, [], "Deleted comment = #{params[:id]}"), status: :ok
  end

  private

  def set_health_center_submission_status
    @health_center_submission_status = HealthCenterSubmissionStatus.find_by(id: params[:health_center_submission_status_id])
    return if @health_center_submission_status

    render json: fmt(not_found, [],
                     "Not found health_center_submission_status id = #{params[:health_center_submission_status_id]}"),
           status: :not_found
  end

  def set_comment
    @comment = @health_center_submission_status.comments.find_by(id: params[:id])
    return if @comment

    render json: fmt(not_found, [], "Not found comment id = #{params[:id]}"), status: :not_found
  end

  def comment_params
    source = params[:comment] || params
    ActionController::Parameters.new(source.to_unsafe_h).permit(:body)
  end
end
