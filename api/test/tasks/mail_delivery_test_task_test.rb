# frozen_string_literal: true

require 'test_helper'
require 'rake'

class MailDeliveryTestTaskTest < ActiveSupport::TestCase
  self.fixture_table_names = []

  setup do
    Rails.application.load_tasks if Rake::Task.tasks.none? { |task| task.name == 'mail:delivery_test' }
    Rake::Task['mail:delivery_test'].reenable
    ActionMailer::Base.deliveries.clear
    ENV['GMAIL_ADDRESS'] = 'sender@example.com'
    ENV.delete('MAIL_DELIVERY_TEST_TO')
    ENV.delete('MAIL_DELIVERY_TEST_SUBJECT')
    ENV.delete('MAIL_DELIVERY_TEST_BODY')
  end

  teardown do
    ENV.delete('ALLOW_MAIL_DELIVERY_TEST')
    ENV.delete('MAIL_DELIVERY_TEST_TO')
    ENV.delete('MAIL_DELIVERY_TEST_SUBJECT')
    ENV.delete('MAIL_DELIVERY_TEST_BODY')
  end

  test 'does not send without explicit allow flag' do
    assert_no_difference -> { ActionMailer::Base.deliveries.size } do
      assert_raises(SystemExit) { Rake::Task['mail:delivery_test'].invoke }
    end
  end

  test 'sends to gmail address when explicitly allowed' do
    ENV['ALLOW_MAIL_DELIVERY_TEST'] = 'true'

    assert_difference -> { ActionMailer::Base.deliveries.size }, 1 do
      Rake::Task['mail:delivery_test'].invoke
    end

    mail = ActionMailer::Base.deliveries.last
    assert_equal ['sender@example.com'], mail.to
    assert_equal ['sender@example.com'], mail.from
    assert_equal 'Group Manager mail delivery test', mail.subject
  end

  test 'can override recipient and message' do
    ENV['ALLOW_MAIL_DELIVERY_TEST'] = 'true'
    ENV['MAIL_DELIVERY_TEST_TO'] = 'recipient@example.com'
    ENV['MAIL_DELIVERY_TEST_SUBJECT'] = 'custom subject'
    ENV['MAIL_DELIVERY_TEST_BODY'] = 'custom body'

    Rake::Task['mail:delivery_test'].invoke

    mail = ActionMailer::Base.deliveries.last
    assert_equal ['recipient@example.com'], mail.to
    assert_equal 'custom subject', mail.subject
    assert_equal 'custom body', mail.body.encoded
  end
end
