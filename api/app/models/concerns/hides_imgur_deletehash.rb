# frozen_string_literal: true

module HidesImgurDeletehash
  extend ActiveSupport::Concern

  # Override Rails standard as_json to keep imgur_deletehash out of API responses.
  def as_json(options = {})
    options = (options || {}).dup
    options[:except] = Array(options[:except]) + [:imgur_deletehash]
    super
  end
end
