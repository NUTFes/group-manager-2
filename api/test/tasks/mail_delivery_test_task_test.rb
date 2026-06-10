# frozen_string_literal: true

require 'test_helper'
require 'minitest/mock'
require 'rake'

class MailDeliveryTestTaskTest < ActiveSupport::TestCase
  self.fixture_table_names = []

  FakeResponse = Struct.new(:code, :body, :headers) do
    delegate :[], to: :headers
  end

  setup do
    Rails.application.load_tasks if Rake::Task.tasks.none? { |task| task.name == 'mail:delivery_test' }
    Rake::Task['mail:delivery_test'].reenable
    ENV['GMAIL_ADDRESS'] = 'sender@example.com'
    ENV['MAIL_DELIVERY_TEST_EMAIL'] = 'admin@example.com'
    ENV['MAIL_DELIVERY_TEST_PASSWORD'] = 'password'
    ENV.delete('MAIL_DELIVERY_TEST_API_URL')
    ENV.delete('MAIL_DELIVERY_TEST_TO')
    ENV.delete('MAIL_DELIVERY_TEST_SUBJECT')
    ENV.delete('MAIL_DELIVERY_TEST_BODY')
  end

  teardown do
    ENV.delete('ALLOW_MAIL_DELIVERY_TEST')
    ENV.delete('MAIL_DELIVERY_TEST_API_URL')
    ENV.delete('MAIL_DELIVERY_TEST_EMAIL')
    ENV.delete('MAIL_DELIVERY_TEST_PASSWORD')
    ENV.delete('MAIL_DELIVERY_TEST_TO')
    ENV.delete('MAIL_DELIVERY_TEST_SUBJECT')
    ENV.delete('MAIL_DELIVERY_TEST_BODY')
  end

  test 'does not call the API without explicit allow flag' do
    assert_raises(SystemExit) { Rake::Task['mail:delivery_test'].invoke }
  end

  test 'signs in and requests mail delivery API when explicitly allowed' do
    ENV['ALLOW_MAIL_DELIVERY_TEST'] = 'true'
    requests = []

    Net::HTTP.stub(:start, fake_http_start(requests)) do
      Rake::Task['mail:delivery_test'].invoke
    end

    request_paths = requests.map { |request| request.uri.path }
    assert_equal ['/api/auth/sign_in', '/api/v1/mail_deliveries'], request_paths
    assert_equal({ 'email' => 'admin@example.com', 'password' => 'password' }, JSON.parse(requests.first.body))
    assert_equal(
      { 'to' => 'sender@example.com', 'subject' => 'Group Manager mail delivery API test' },
      JSON.parse(requests.second.body).slice('to', 'subject')
    )
    assert_equal 'token', requests.second['access-token']
    assert_equal 'client-id', requests.second['client']
    assert_equal 'admin@example.com', requests.second['uid']
  end

  test 'can override API URL recipient and message' do
    ENV['ALLOW_MAIL_DELIVERY_TEST'] = 'true'
    ENV['MAIL_DELIVERY_TEST_API_URL'] = 'https://group-manager-api.example.com'
    ENV['MAIL_DELIVERY_TEST_TO'] = 'recipient@example.com'
    ENV['MAIL_DELIVERY_TEST_SUBJECT'] = 'custom subject'
    ENV['MAIL_DELIVERY_TEST_BODY'] = 'custom body'
    requests = []

    Net::HTTP.stub(:start, fake_http_start(requests)) do
      Rake::Task['mail:delivery_test'].invoke
    end

    assert_equal 'group-manager-api.example.com', requests.first.uri.hostname
    assert_equal true, requests.first.uri.instance_of?(URI::HTTPS)
    assert_equal(
      { 'to' => 'recipient@example.com', 'subject' => 'custom subject', 'body' => 'custom body' },
      JSON.parse(requests.second.body)
    )
  end

  private

  def fake_http_start(requests)
    lambda do |_hostname, _port, use_ssl:, &block|
      requests.define_singleton_method(:use_ssl) { use_ssl }
      block.call(FakeHttp.new(requests))
    end
  end

  class FakeHttp
    def initialize(requests)
      @requests = requests
    end

    def request(request)
      @requests << request
      return sign_in_response if request.uri.path == '/api/auth/sign_in'

      FakeResponse.new('200', '{"status":{"code":200}}', {})
    end

    private

    def sign_in_response
      FakeResponse.new(
        '200',
        '{"data":{"email":"admin@example.com"}}',
        {
          'access-token' => 'token',
          'client' => 'client-id',
          'uid' => 'admin@example.com'
        }
      )
    end
  end
end
