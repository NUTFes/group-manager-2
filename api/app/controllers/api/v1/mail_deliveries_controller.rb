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
      subject: rendered_subject,
      body: rendered_body
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

  def template_values
    return {} if params[:template_values].blank?

    params.require(:template_values).permit(MessageTemplate::SUPPORTED_VARIABLES).to_h
  end

  def rendered_subject
    return mail_delivery_params[:subject] if template_values.blank?

    message_template_for_render.render_subject(template_values)
  end

  def rendered_body
    return mail_delivery_params[:body] if template_values.blank?

    message_template_for_render.render_body(template_values)
  end

  def message_template_for_render
    @message_template_for_render ||= MessageTemplate.new(
      locale: :ja,
      name: 'mail_delivery',
      subject: mail_delivery_params[:subject],
      body: mail_delivery_params[:body]
    )
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
