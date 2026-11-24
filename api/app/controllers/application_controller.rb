# frozen_string_literal: true

require 'digest'

class ApplicationController < ActionController::API
  include DeviseTokenAuth::Concerns::SetUserByToken

  MANAGER_ROLE_ID = 1
  # 管理画面を使うロール。staffは閲覧専用で、書き込みはmanagerだけ
  STAFF_OR_ABOVE_ROLE_IDS = [1, 2].freeze

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

  def conflict
    return { code: 409, message: 'Conflict' }
  end

  def unauthorized
    return { code: 401, message: 'Unauthorized' }
  end

  # 出力するAPIのフォーマット
  def fmt(status = undefined, data = [], option = '')
    # メッセージを追加したいときに使う
    status.store('option', option) if option != ''
    return { status: status, data: data }
    # return { status: status, path: request.fullpath, data: data } // fullpathいるかな？
  end

  # create/update のバリデーション失敗時に共通で使うエラーレスポンス
  def render_validation_errors(record)
    render json: fmt(unprocessable_entity, [], record.errors.full_messages.join(', ')), status: :unprocessable_entity
  end

  private

  def set_skip_slack_notification
    Current.skip_slack_notification = skip_slack_notification_header?
    yield
  ensure
    Current.reset
  end

  def skip_slack_notification_header?
    !Rails.env.production? && request.headers['X-Skip-Slack-Notification'].to_s == 'true'
  end

  def staff_or_above?
    STAFF_OR_ABOVE_ROLE_IDS.include?(current_api_user&.role_id)
  end

  def manager?
    current_api_user&.role_id == MANAGER_ROLE_ID
  end

  # 管理画面の参照系APIはstaff以上（role_id 1, 2）に限定する
  def require_staff!
    return if staff_or_above?

    render_forbidden
  end

  # 管理画面の書き込み系APIはmanager（role_id 1）に限定する
  def require_manager!
    return if manager?

    render_forbidden
  end

  # staffは管理画面の閲覧専用のため、userの画面から呼ばれる書き込み系APIも拒否する
  def reject_staff_write!
    return if manager? || !staff_or_above?

    render_forbidden
  end

  def render_forbidden
    render json: fmt({ code: 403, message: 'Forbidden' }, []),
           status: :forbidden
  end

  # staff以上は全団体、それ以外は自団体に紐づくレコードだけに絞る
  def scope_to_accessible_groups(relation)
    return relation if staff_or_above?

    relation.where(group_id: current_api_user.groups.select(:id))
  end

  def accessible_group?(group_id)
    staff_or_above? || current_api_user.groups.exists?(id: group_id)
  end

  # 対象が見つからないとき、staff以上には各controllerの既存のNot foundを返し、
  # それ以外には他団体のレコードか存在しないIDかを区別させないよう403を返す
  def render_not_found_or_forbidden
    return render_forbidden unless staff_or_above?

    yield
  end

  # staff以上でなければ、指定できるuser_idは自分だけにする
  def require_own_user_id!
    return if staff_or_above? || params[:user_id].blank? || params[:user_id].to_s == current_api_user.id.to_s

    render_forbidden
  end

  # 一括登録（upsert）で受け取った全レコードが、自団体（staff以上は全団体）の範囲かを確認する。
  # group_idだけでなく既存のidも確認し、他団体のレコードをidで上書きできないようにする
  def accessible_bulk_records?(relation, records)
    return true if staff_or_above?

    group_ids = records.filter_map { |attrs| attrs[:group_id]&.to_s }.uniq
    return false unless current_api_user.groups.where(id: group_ids).count == group_ids.size

    ids = records.filter_map { |attrs| attrs[:id].presence&.to_s }.uniq
    ids.empty? || scope_to_accessible_groups(relation).where(id: ids).count == ids.size
  end

  # 指定されたgroup_idが自団体（staff以上は全団体）でなければ403にする。
  # 未指定ならモデルの必須バリデーションに委ねる（updateでの部分更新も許可する）
  def require_accessible_group_param!(group_id = params[:group_id])
    return true if group_id.blank? || accessible_group?(group_id)

    render_forbidden
    false
  end

  # staff以上は全団体、それ以外は自団体から探す
  def current_api_user_group(group_id)
    return nil if group_id.blank?

    (staff_or_above? ? Group.all : current_api_user.groups).find_by(id: group_id)
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
