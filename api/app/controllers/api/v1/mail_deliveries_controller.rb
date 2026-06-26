# frozen_string_literal: true

class Api::V1::MailDeliveriesController < ApplicationController
  before_action :authenticate_api_user!
  before_action :require_admin!

  EMAIL_REGEXP = URI::MailTo::EMAIL_REGEXP
  MULTIPLE_RECIPIENTS_REGEXP = /[,;]|\S+@\S+\s+\S+@\S+|<[^>]+>.*<[^>]+>/

  def create
    errors = validate_mail_delivery_params
    return render json: fmt(unprocessable_entity, errors), status: :unprocessable_entity if errors.present?

    mail = GenericMailer.plain_text_email(
      to: mail_delivery_params[:to],
      subject: mail_delivery_params[:subject],
      body: mail_delivery_params[:body]
    )
    mail.deliver_now

    render json: fmt(ok, [], 'Delivered mail')
  end

  private

  def require_admin!
    # TODO: 管理者向けAPIは別issueでロールごとの制限機能を追加し、実装後にこの暫定判定を削除する。
    return if [1, 2].include?(current_api_user&.role_id)

    render json: fmt({ code: 403, message: 'Forbidden' }, []),
           status: :forbidden
  end

  def mail_delivery_params
    params.permit(:to, :subject, :body)
  end

  def validate_mail_delivery_params
    errors = []
    errors << 'to is required' if mail_delivery_params[:to].blank?
    errors << 'subject is required' if mail_delivery_params[:subject].blank?
    errors << 'body is required' if mail_delivery_params[:body].blank?
    if mail_delivery_params[:to].present?
      if multiple_recipients?
        errors << 'to must be a single email address'
      elsif !valid_email?
        errors << 'to is invalid'
      end
    end
    errors
  end

  def multiple_recipients?
    mail_delivery_params[:to].to_s.match?(MULTIPLE_RECIPIENTS_REGEXP)
  end

  def valid_email?
    mail_delivery_params[:to].to_s.match?(EMAIL_REGEXP)
  end
end
