# frozen_string_literal: true

namespace :mail do
  desc 'Send a real test email to confirm Gmail delivery. Requires ALLOW_MAIL_DELIVERY_TEST=true.'
  task delivery_test: :environment do
    abort 'Set ALLOW_MAIL_DELIVERY_TEST=true to send a real test email.' unless ENV['ALLOW_MAIL_DELIVERY_TEST'] == 'true'

    to = ENV.fetch('MAIL_DELIVERY_TEST_TO', ENV.fetch('GMAIL_ADDRESS'))
    subject = ENV.fetch('MAIL_DELIVERY_TEST_SUBJECT', 'Group Manager mail delivery test')
    body = ENV.fetch(
      'MAIL_DELIVERY_TEST_BODY',
      "This is a mail delivery test from #{Rails.env} at #{Time.current}."
    )

    mail = GenericMailer.plain_text_email(to: to, subject: subject, body: body)
    mail.deliver_now

    puts "Delivered test email to #{mail.to.join(', ')} from #{mail.from.join(', ')}"
  end
end
