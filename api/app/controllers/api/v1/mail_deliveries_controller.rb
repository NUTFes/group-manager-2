# frozen_string_literal: true

class Api::V1::MailDeliveriesController < ApplicationController
  before_action :authenticate_api_user!
  before_action :require_admin!

  EMAIL_REGEXP = URI::MailTo::EMAIL_REGEXP

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
    return if current_api_user&.role_id == 1

    render json: fmt({ code: 403, message: 'Forbidden' }), status: :forbidden
  end

  def mail_delivery_params
    params.permit(:to, :subject, :body)
  end

  def validate_mail_delivery_params
    errors = []
    errors << 'to is required' if mail_delivery_params[:to].blank?
    errors << 'subject is required' if mail_delivery_params[:subject].blank?
    errors << 'body is required' if mail_delivery_params[:body].blank?
    errors << 'to must be a single email address' if multiple_recipients?
    errors << 'to is invalid' if mail_delivery_params[:to].present? && !valid_email?
    errors
  end

  def multiple_recipients?
    mail_delivery_params[:to].to_s.match?(/[,;]/)
  end

  def valid_email?
    mail_delivery_params[:to].to_s.match?(EMAIL_REGEXP)
  end
end
