# frozen_string_literal: true

require 'net/http'
require 'uri'

class ImgurImageDeleter
  ENDPOINT = 'https://api.imgur.com/3/image/'
  OPEN_TIMEOUT = 2
  READ_TIMEOUT = 5

  def self.call(deletehash)
    new(deletehash).call
  end

  def initialize(deletehash)
    @deletehash = deletehash
  end

  def call
    return true if deletehash.blank?

    if imgur_client_id.blank?
      Rails.logger.warn('[Imgur] delete skipped: IMGUR_CLIENT_ID is not configured')
      return false
    end

    response = request_delete
    return true if response.is_a?(Net::HTTPSuccess)

    Rails.logger.warn("[Imgur] delete failed: status=#{response.code} body=#{response.body}")
    false
  rescue StandardError => e
    Rails.logger.warn("[Imgur] delete failed: #{e.class} #{e.message}")
    false
  end

  private

  attr_reader :deletehash

  def request_delete
    uri = URI("#{ENDPOINT}#{deletehash}")
    request = Net::HTTP::Delete.new(uri)
    request['Authorization'] = "Client-ID #{imgur_client_id}"

    Net::HTTP.start(
      uri.hostname,
      uri.port,
      use_ssl: uri.scheme == 'https',
      open_timeout: OPEN_TIMEOUT,
      read_timeout: READ_TIMEOUT
    ) do |http|
      http.request(request)
    end
  end

  def imgur_client_id
    ENV['IMGUR_CLIENT_ID']
  end
end
