# frozen_string_literal: true

class ApplicationMailer < ActionMailer::Base
  default from: -> { ENV.fetch('GMAIL_ADDRESS', 'no-reply@example.com') }
  layout 'mailer'
end
