# frozen_string_literal: true

class News < ApplicationRecord
  before_save :normalize_body_newlines

  private

  def normalize_body_newlines
    self.body = body.gsub(/\r\n?/, "\n") if body.present?
  end
end
