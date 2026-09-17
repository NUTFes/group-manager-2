# frozen_string_literal: true

class Api::V1::OrderStatusCheckCommentMailsController < ApplicationController
  before_action :require_mail_delivery_role!

  # メモを保存し、保存済みメモの本文をメール送信する
  def create
    errors = validate_comment_mail_params
    return render json: fmt(unprocessable_entity, errors), status: :unprocessable_entity if errors.present?

    group = Group.includes(:user).find_by(id: params[:group_id])
    return render json: fmt(not_found, [], 'group not found'), status: :not_found if group.nil?
    return render json: fmt(unprocessable_entity, [], 'representative email is required'), status: :unprocessable_entity if group.user&.email.blank?

    subject = params[:subject].to_s.strip
    body = params[:body].to_s.strip

    comment = save_failed_mail_comment!(group, subject: subject, body: body)
    deliver_comment_mail!(comment, to: group.user.email, subject: subject, body: body)

    render json: fmt(created, comment_response(comment)), status: :created
  rescue ActiveRecord::RecordInvalid => e
    render json: fmt(unprocessable_entity, e.record.errors.full_messages), status: :unprocessable_entity
  rescue StandardError => e
    render json: fmt({ code: 502, message: 'Mail delivery failed' }, comment_response(comment), e.message),
           status: :bad_gateway
  end

  # メモを保存する（メール送信なし）
  def create_comment
    errors = validate_comment_mail_params
    return render json: fmt(unprocessable_entity, errors), status: :unprocessable_entity if errors.present?

    group = Group.find_by(id: params[:group_id])
    return render json: fmt(not_found, [], 'group not found'), status: :not_found if group.nil?

    comment = group.comments.create!(
      subject: params[:subject].to_s.strip,
      body: params[:body].to_s.strip,
      mail_delivery_status: :memo
    )

    render json: fmt(created, comment_response(comment)), status: :created
  rescue ActiveRecord::RecordInvalid => e
    render json: fmt(unprocessable_entity, e.record.errors.full_messages), status: :unprocessable_entity
  end

  # failed の保存済みメモを再送信する
  def resend
    comment = Comment.includes(commentable: :user).find_by(id: params[:id])
    return render json: fmt(not_found, [], 'comment not found'), status: :not_found if comment.nil?
    return render json: fmt(unprocessable_entity, [], 'comment is not failed'), status: :unprocessable_entity unless comment.failed?
    return render json: fmt(unprocessable_entity, [], 'comment is not an order status check comment'), status: :unprocessable_entity unless comment.commentable.is_a?(Group)

    group = comment.commentable
    return render json: fmt(unprocessable_entity, [], 'representative email is required'), status: :unprocessable_entity if group.user&.email.blank?

    begin
      deliver_comment_mail!(comment, to: group.user.email, subject: comment.subject, body: comment.body)
      render json: fmt(ok, comment_response(comment))
    rescue StandardError => e
      render json: fmt({ code: 502, message: 'Mail delivery failed' }, comment_response(comment), e.message),
             status: :bad_gateway
    end
  end

  private

  def validate_comment_mail_params
    errors = []
    errors << 'group_id is required' if params[:group_id].blank?
    errors << 'subject is required' if params[:subject].to_s.strip.blank?
    errors << 'body is required' if params[:body].to_s.strip.blank?
    errors
  end

  def require_mail_delivery_role!
    return if [1, 2].include?(current_api_user&.role_id)

    render json: fmt({ code: 403, message: 'Forbidden' }, []),
           status: :forbidden
  end

  def save_failed_mail_comment!(group, subject:, body:)
    group.comments.create!(
      subject: subject,
      body: body,
      mail_delivery_status: :failed
    )
  end

  def deliver_comment_mail!(comment, to:, subject:, body:)
    GenericMailer.plain_text_email(
      to: to,
      subject: subject,
      body: body
    ).deliver_now!
    comment.update!(mail_delivery_status: :sent)
  end

  def comment_response(comment)
    return {} if comment.nil?

    {
      id: comment.id,
      subject: comment.subject,
      body: comment.body,
      mail_delivery_status: comment.mail_delivery_status,
      created_at: comment.created_at,
      commentable_type: comment.commentable_type,
      commentable_id: comment.commentable_id
    }
  end
end
