# frozen_string_literal: true

class Api::V1::MessageTemplatesController < ApplicationController
  COPY_SUFFIX = { 'ja' => 'のコピー', 'en' => ' copy' }.freeze

  before_action :authenticate_api_user!
  before_action :require_admin!
  before_action :set_message_template, only: %i[show update copy_source]
  before_action :validate_locale_param, only: %i[create update]

  rescue_from ActiveRecord::RecordNotFound do
    render json: fmt(not_found, [], "Not found message_template id = #{params[:id]}"), status: :not_found
  end

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
      render json: fmt(ok, @message_template, "Updated message_template id = #{params[:id]}")
    else
      render json: fmt(unprocessable_entity, @message_template.errors.full_messages), status: :unprocessable_entity
    end
  end

  # 複製画面で元テンプレートと区別できる初期値を返すため、保存前の段階でコピー名を付与する。
  def copy_source
    copy_source = {
      locale: @message_template.locale,
      name: "#{@message_template.name}#{COPY_SUFFIX[@message_template.locale]}",
      subject: @message_template.subject,
      body: @message_template.body
    }

    render json: fmt(ok, copy_source)
  end

  private

  def require_admin!
    # TODO: 管理者向けAPIは別issueでロールごとの制限機能を追加し、実装後にこの暫定判定を削除する。
    return if [1, 2].include?(current_api_user&.role_id)

    render json: fmt({ code: 403, message: 'Forbidden' }, []),
           status: :forbidden
  end

  def set_message_template
    @message_template = MessageTemplate.find(params[:id])
  end

  def validate_locale_param
    return if params[:locale].blank?
    return if MessageTemplate.locales.key?(params[:locale])

    render json: fmt(unprocessable_entity, ['locale is invalid']),
           status: :unprocessable_entity
  end

  def message_template_params
    params.permit(:locale, :name, :subject, :body)
  end
end
