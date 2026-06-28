# frozen_string_literal: true

require 'test_helper'

class GenericMailerTest < ActionMailer::TestCase
  self.fixture_table_names = []

  setup do
    @original_gmail_address = ENV.fetch('GMAIL_ADDRESS', nil)
    ENV['GMAIL_ADDRESS'] = 'no-reply@example.com'
  end

  teardown do
    ENV['GMAIL_ADDRESS'] = @original_gmail_address
  end

  test 'plain_text_email builds a text email' do
    mail = GenericMailer.plain_text_email(
      to: 'recipient@example.com',
      subject: 'テスト件名',
      body: 'テスト本文'
    )

    assert_equal ['recipient@example.com'], mail.to
    assert_equal ['no-reply@example.com'], mail.from
    assert_equal 'テスト件名', mail.subject
    assert_equal 'テスト本文', mail.body.encoded
    assert_match %r{\Atext/plain}, mail.content_type
  end

  test 'plain_text_email uses fallback sender when gmail address is unset' do
    ENV.delete('GMAIL_ADDRESS')

    mail = GenericMailer.plain_text_email(
      to: 'recipient@example.com',
      subject: 'テスト件名',
      body: 'テスト本文'
    )

    assert_equal ['no-reply@example.com'], mail.from
  end
end
