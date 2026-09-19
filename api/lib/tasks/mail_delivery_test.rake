# frozen_string_literal: true

require 'json'
require 'net/http'
require 'uri'

class MailDeliveryApiTestClient
  def initialize(base_url:)
    @base_url = base_url.to_s
  end

  def sign_in(email:, password:)
    response = post_json('/api/auth/sign_in', email: email, password: password)
    raise "Sign in failed: #{response.code} #{response.body}" unless success?(response)

    {
      'access-token' => response['access-token'],
      'client' => response['client'],
      'uid' => response['uid']
    }
  end

  def deliver_mail(headers:, to:, subject:, body:)
    response = post_json('/api/v1/mail_deliveries', { to: to, subject: subject, body: body }, headers)
    raise "Mail delivery API failed: #{response.code} #{response.body}" unless success?(response)

    response
  end

  private

  def post_json(path, payload, headers = {})
    uri = URI.join("#{@base_url.chomp('/')}/", path.delete_prefix('/'))
    request = Net::HTTP::Post.new(uri)
    request['Content-Type'] = 'application/json'
    headers.each { |key, value| request[key] = value }
    request.body = payload.to_json

    Net::HTTP.start(uri.hostname, uri.port, use_ssl: uri.scheme == 'https') do |http|
      http.request(request)
    end
  end

  def success?(response)
    response.code.to_i.between?(200, 299)
  end
end

namespace :mail do
  desc 'Send a real test email through the mail delivery API. Requires ALLOW_MAIL_DELIVERY_TEST=true.'
  task delivery_test: :environment do
    abort 'Set ALLOW_MAIL_DELIVERY_TEST=true to send a real test email through the API.' unless ENV['ALLOW_MAIL_DELIVERY_TEST'] == 'true'

    client = MailDeliveryApiTestClient.new(
      base_url: ENV.fetch('MAIL_DELIVERY_TEST_API_URL', 'http://api:3000')
    )
    headers = client.sign_in(
      email: required_env('MAIL_DELIVERY_TEST_EMAIL'),
      password: required_env('MAIL_DELIVERY_TEST_PASSWORD')
    )

    to = required_env('MAIL_DELIVERY_TEST_TO')
    subject = ENV.fetch('MAIL_DELIVERY_TEST_SUBJECT', 'Group Manager mail delivery API test')
    body = ENV.fetch(
      'MAIL_DELIVERY_TEST_BODY',
      "This is a mail delivery API test from #{Rails.env} at #{Time.current}."
    )

    client.deliver_mail(headers: headers, to: to, subject: subject, body: body)

    puts "Requested mail delivery API at #{ENV.fetch('MAIL_DELIVERY_TEST_API_URL', 'http://api:3000')}"
    puts "Sent test email to #{to}"
  end

  def required_env(key)
    ENV.fetch(key) { abort "Set #{key} in .env or command env." }
  end
end
