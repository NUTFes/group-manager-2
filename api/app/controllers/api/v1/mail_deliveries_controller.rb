# frozen_string_literal: true

class Api::V1::MailDeliveriesController < ApplicationController
  before_action :authenticate_api_user!
  before_action :require_admin!

  EMAIL_REGEXP = URI::MailTo::EMAIL_REGEXP

  def create
    errors = validate_mail_delivery_params
    return render json: fmt(unprocessable_entity, errors), status: :unprocessable_entity if errors.present?

    mail = GenericMailer.plain_text_email(
      to: recipient,
      subject: mail_delivery_params[:subject],
      body: mail_delivery_params[:body]
    )
    return render json: fmt(ok, dry_run_response(mail), 'Dry run mail') if dry_run?

    mail.deliver_now

    render json: fmt(ok, [], 'Delivered mail')
  end

  private

  def require_admin!
    return if current_api_user&.role_id == 1

    render json: fmt({ code: 403, message: 'Forbidden' }), status: :forbidden
  end

  def mail_delivery_params
    params.permit(:to, :subject, :body, :dry_run)
  end

  def validate_mail_delivery_params
    errors = []
    errors << 'to is required' if mail_delivery_params[:to].blank? && !dry_run?
    errors << 'subject is required' if mail_delivery_params[:subject].blank?
    errors << 'body is required' if mail_delivery_params[:body].blank?
    errors << 'to must be a single email address' if !dry_run? && multiple_recipients?
    errors << 'to is invalid' if !dry_run? && mail_delivery_params[:to].present? && !valid_email?
    errors
  end

  def recipient
    return ENV.fetch('GMAIL_ADDRESS') if dry_run?

    mail_delivery_params[:to]
  end

  def dry_run?
    ActiveModel::Type::Boolean.new.cast(mail_delivery_params[:dry_run])
  end

  def dry_run_response(mail)
    {
      dry_run: true,
      delivered: false,
      to: mail.to,
      from: mail.from,
      subject: mail.subject
    }
  end

  def multiple_recipients?
    mail_delivery_params[:to].to_s.match?(/[,;]/)
  end

  def valid_email?
    mail_delivery_params[:to].to_s.match?(EMAIL_REGEXP)
  end
end
