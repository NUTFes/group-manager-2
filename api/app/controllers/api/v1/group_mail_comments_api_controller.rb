# frozen_string_literal: true

class Api::V1::GroupMailCommentsApiController < Api::V1::StaffController
  def index
    group = Group.includes(:comments, health_center_submission_statuses: :comments)
                 .find_by(id: params[:group_id])
    return render json: fmt(not_found, [], 'group not found'), status: :not_found if group.nil?

    # 申請状況から送られたコメント (commentable: Group)
    order_status_comments = group.comments.map do |c|
      comment_response(c).merge(source: 'order_status')
    end

    # 保健所確認から送られたコメント (commentable: HealthCenterSubmissionStatus)
    health_center_comments = group.health_center_submission_statuses.includes(:comments).flat_map do |status|
      status.comments.map do |c|
        comment_response(c).merge(source: 'health_center')
      end
    end

    all_comments = (order_status_comments + health_center_comments).sort_by { |c| c[:created_at] }.reverse

    render json: fmt(ok, all_comments)
  end

  private

  def comment_response(comment)
    {
      id: comment.id,
      body: comment.body,
      mail_delivery_status: comment.mail_delivery_status,
      created_at: comment.created_at,
      commentable_type: comment.commentable_type,
      commentable_id: comment.commentable_id
    }
  end
end
