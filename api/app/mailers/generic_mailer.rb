# frozen_string_literal: true

class GenericMailer < ApplicationMailer
  def plain_text_email(to:, subject:, body:)
    mail(to: to, subject: subject, body: body, content_type: 'text/plain')
  end
end
