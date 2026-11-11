ENV['RAILS_ENV'] ||= 'test'
require_relative '../config/environment'
require 'rails/test_help'

class ActiveSupport::TestCase
  # Run tests in parallel with specified workers
  parallelize(workers: :number_of_processors)

  # Setup all fixtures in test/fixtures/*.yml for all tests in alphabetical order.
  fixtures :all

  # Add more helper methods to be used by all tests here...
end

class ActionDispatch::IntegrationTest
  # authenticate_api_user! が必要なAPIを呼ぶための認証ヘッダー。
  # ロールによる制限は見ないテスト向けなので、ロールは問わずユーザーを1人作る。
  def api_auth_headers
    @api_auth_headers ||= begin
      role = Role.first || Role.create!(name: 'user')
      user = User.create!(
        name: 'api-auth-test-user',
        email: "api-auth-test-user-#{SecureRandom.hex(4)}@example.com",
        password: 'password',
        password_confirmation: 'password',
        role: role
      )
      user.create_new_auth_token
    end
  end
end
