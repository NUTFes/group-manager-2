# frozen_string_literal: true

class Api::V1::MessageTemplatesController < ApplicationController
  before_action :authenticate_api_user!
  before_action :require_admin!
  before_action :ensure_default_templates, only: %i[index show]
  before_action :set_message_template, only: %i[show update duplicate]

  def index
    templates = MessageTemplate.order(:name, :locale)
    render json: fmt(ok, templates)
  end

  def show
    render json: fmt(ok, @message_template)
  end

  def create
    template = MessageTemplate.new(message_template_params)
    if template.save
      render json: fmt(created, template), status: :created
    else
      render json: fmt(unprocessable_entity, template.errors.full_messages), status: :unprocessable_entity
    end
  end

  def update
    if @message_template.update(message_template_params)
      render json: fmt(created, @message_template, "Updated message_template id = #{params[:id]}")
    else
      render json: fmt(unprocessable_entity, @message_template.errors.full_messages), status: :unprocessable_entity
    end
  end

  def duplicate
    template = MessageTemplate.new(
      locale: duplicate_params[:locale].presence || @message_template.locale,
      name: duplicate_params[:name].presence || "#{@message_template.name} のコピー",
      subject: duplicate_params[:subject].presence || @message_template.subject,
      body: duplicate_params[:body].presence || @message_template.body
    )

    if template.save
      render json: fmt(created, template), status: :created
    else
      render json: fmt(unprocessable_entity, template.errors.full_messages), status: :unprocessable_entity
    end
  end

  private

  def require_admin!
    return if current_api_user&.role_id == 1

    render json: fmt({ code: 403, message: 'Forbidden' }), status: :forbidden
  end

  def ensure_default_templates
    MessageTemplate.ensure_defaults!
  end

  def set_message_template
    @message_template = MessageTemplate.find(params[:id])
  end

  def message_template_params
    params.permit(:locale, :name, :subject, :body)
  end

  def duplicate_params
    params.permit(:locale, :name, :subject, :body)
  end
end
