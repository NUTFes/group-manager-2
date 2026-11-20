# frozen_string_literal: true

require 'test_helper'

class FilterParameterLoggingTest < ActiveSupport::TestCase
  test 'filters password and secret parameters' do
    assert_includes Rails.application.config.filter_parameters, :password
    assert_includes Rails.application.config.filter_parameters, :secret
  end
end
