# frozen_string_literal: true

require 'digest'

class ApplicationController < ActionController::API
  include DeviseTokenAuth::Concerns::SetUserByToken

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
