# frozen_string_literal: true

class MessageTemplate < ApplicationRecord
  SUPPORTED_VARIABLES = %w[group_name user_name].freeze

  enum locale: { ja: 0, en: 1 }

  SUPPORTED_LOCALES = locales.keys.freeze

  validates :locale, :name, :subject, :body, presence: true
  validates :name, uniqueness: { scope: :locale }

  before_save :normalize_newlines

  def self.render_text(text, values)
    normalized_values = values.to_h.stringify_keys

    text.gsub(/\{(#{SUPPORTED_VARIABLES.join('|')})\}/) do
      normalized_values[Regexp.last_match(1)].to_s
    end
  end

  def render_subject(values)
    self.class.render_text(subject, values)
  end

  def render_body(values)
    self.class.render_text(body, values)
  end

  private

  def normalize_newlines
    self.body = body.gsub(/\r\n?/, "\n") if body.present?
  end
end
