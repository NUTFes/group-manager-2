# frozen_string_literal: true

require 'digest'
require Rails.root.join('lib/api_access_control_registry')

class ApplicationController < ActionController::API
  include DeviseTokenAuth::Concerns::SetUserByToken

  before_action :enforce_api_access_policy!
  around_action :set_skip_slack_notification

  # status
  def ok
    return { code: 200, message: 'Success' }
  end

  def created
    return { code: 201, message: 'Created' }
  end

  def not_found
    return { code: 404, message: 'Not Found' }
  end

  def internal_server_error
    return { code: 500, message: 'Internal Server Error' }
  end

  def undefined
    return { code: 999, message: 'Undefined' }
  end

  def unprocessable_entity
    return { code: 422, message: 'Unprocessable Entity' }
  end

  # 出力するAPIのフォーマット
  def fmt(status = undefined, data = [], option = '')
    # メッセージを追加したいときに使う
    status.store('option', option) if option != ''
    return { status: status, data: data }
    # return { status: status, path: request.fullpath, data: data } // fullpathいるかな？
  end

  private

  def enforce_api_access_policy!
    category = api_access_control_registry.category_for(controller_path, action_name)
    return if %w[excluded public].include?(category)

    if %w[participant staff manager].include?(category)
      authenticate_api_user!
      return if performed?
    end

    require_staff_or_above! if %w[staff manager].include?(category)
    return if performed?

    require_manager! if category == 'manager'
    return if performed? || %w[participant staff manager].include?(category)

    render json: fmt({ code: 403, message: 'Forbidden' }), status: :forbidden
  end

  def api_access_control_registry
    registry = Rails.application.config.x[:api_access_control_registry]
    return registry if registry.is_a?(ApiAccessControlRegistry)

    Rails.application.config.x[:api_access_control_registry] = ApiAccessControlRegistry.new
  end

  def set_skip_slack_notification
    Current.skip_slack_notification = skip_slack_notification_header?
    yield
  ensure
    Current.reset
  end

  def skip_slack_notification_header?
    !Rails.env.production? && request.headers['X-Skip-Slack-Notification'].to_s == 'true'
  end

  def require_staff_or_above!
    return if current_api_user&.role_id.in?(Role::STAFF_OR_ABOVE_IDS)

    render json: fmt({ code: 403, message: 'Forbidden' }),
           status: :forbidden
  end

  def require_manager!
    return if current_api_user&.role_id == Role::MANAGER_ID

    render json: fmt({ code: 403, message: 'Forbidden' }),
           status: :forbidden
  end

  def current_api_user_group(group_id)
    return nil if group_id.blank?

    current_api_user.groups.find_by(id: group_id)
  end

  def current_api_user_group!(group_id)
    group = current_api_user_group(group_id)
    return group if group

    render json: fmt(not_found, [], 'Not Found'), status: :not_found
    nil
  end

  def participant_scope(model)
    model.where(group_id: current_api_user.groups.select(:id))
  end

  def participant_record!(model, id)
    record = participant_scope(model).find_by(id: id)
    return record if record

    render json: fmt(not_found, [], 'Not Found'), status: :not_found
    nil
  end

  def save_health_center_submission_status(submission_status, unprocessable_http_status: nil)
    unless HealthCenterSubmissionStatus.statuses.key?(params[:status].to_s)
      return render_health_center_submission_status_unprocessable(
        'Invalid status',
        unprocessable_http_status
      )
    end

    submission_status.status = params[:status]

    if submission_status.save
      render json: fmt(ok, health_center_submission_status_payload(submission_status))
    else
      render_health_center_submission_status_unprocessable(
        submission_status.errors.full_messages.join(', '),
        unprocessable_http_status
      )
    end
  end

  def health_center_submission_status_payload(submission_status)
    {
      id: submission_status.id,
      group_id: submission_status.group_id,
      application_type: submission_status.application_type,
      status: submission_status.status
    }
  end

  def render_health_center_submission_status_unprocessable(message, http_status)
    response = { json: fmt(unprocessable_entity, [], message) }
    response[:status] = http_status if http_status

    render response
  end

  def translate_to_ja(text)
    return text if text.blank?
    return text unless translatable_english_text?(text)
    return text if deepl_api_key.blank?

    Rails.cache.fetch(deepl_cache_key('ja', text), expires_in: 7.days) do
      request_deepl_translation(text, 'JA')
    end
  rescue StandardError => e
    Rails.logger.warn("[DeepL] translation failed: #{e.class} #{e.message}")
    text
  end

  def translate_to_en(text)
    return text if text.blank?
    return text if deepl_api_key.blank?

    Rails.cache.fetch(deepl_cache_key('en', text), expires_in: 7.days) do
      request_deepl_translation(text, 'EN-US')
    end
  rescue StandardError => e
    Rails.logger.warn("[DeepL] translation failed: #{e.class} #{e.message}")
    text
  end

  def request_deepl_translation(text, target_lang)
    translation = DeepL.translate(text, nil, target_lang)
    translation&.text.presence || text
  rescue DeepL::Exceptions::RequestError => e
    Rails.logger.warn("[DeepL] request failed: #{e.class} #{e.message}")
    text
  end

  def deepl_api_key
    ENV['DEEPL_API_KEY'].presence
  end

  def deepl_cache_key(lang, text)
    "deepl:#{lang}:#{Digest::SHA256.hexdigest(text)}"
  end

  def translatable_english_text?(text)
    has_latin = text.match?(/[A-Za-z]/)
    has_japanese = text.match?(/[\p{Hiragana}\p{Katakana}\p{Han}]/)
    has_latin && !has_japanese
  end
end
