# frozen_string_literal: true

class ApplicationMailer < ActionMailer::Base
  default from: ENV.fetch('MAILER_SENDER', 'no-reply@group-manager.nutfes.net')
  layout 'mailer'
end
