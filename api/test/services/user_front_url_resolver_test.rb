# frozen_string_literal: true

require 'test_helper'

class UserFrontUrlResolverTest < ActiveSupport::TestCase
  test 'resolves development url when APP_ENV is development' do
    with_app_env('development') do
      assert_equal 'http://localhost:8003', UserFrontUrlResolver.call
    end
  end

  test 'raises when APP_ENV is unset' do
    with_app_env(nil) do
      error = assert_raises(RuntimeError) { UserFrontUrlResolver.call }
      assert_equal 'APP_ENV must be set', error.message
    end
  end

  test 'raises when APP_ENV is blank' do
    with_app_env('') do
      error = assert_raises(RuntimeError) { UserFrontUrlResolver.call }
      assert_equal 'APP_ENV must be set', error.message
    end
  end

  test 'resolves staging url' do
    with_app_env('staging') do
      assert_equal 'https://stg-group-manager.nutfes.net', UserFrontUrlResolver.call
    end
  end

  test 'resolves production url' do
    with_app_env('production') do
      assert_equal 'https://group-manager.nutfes.net', UserFrontUrlResolver.call
    end
  end

  test 'raises for an unknown APP_ENV instead of silently falling back' do
    with_app_env('unknown') do
      error = assert_raises(RuntimeError) { UserFrontUrlResolver.call }
      assert_equal 'Unsupported APP_ENV: unknown', error.message
    end
  end

  private

  def with_app_env(value)
    original = ENV.fetch('APP_ENV', nil)
    if value.nil?
      ENV.delete('APP_ENV')
    else
      ENV['APP_ENV'] = value
    end
    yield
  ensure
    if original.nil?
      ENV.delete('APP_ENV')
    else
      ENV['APP_ENV'] = original
    end
  end
end
