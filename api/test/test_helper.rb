ENV['RAILS_ENV'] ||= 'test'
require_relative '../config/environment'
require 'rails/test_help'

Dir[File.expand_path('support/**/*.rb', __dir__)].each { |file| require file }

class ActiveSupport::TestCase
  # Run tests in parallel with specified workers
  parallelize(workers: :number_of_processors)

  # Setup all fixtures in test/fixtures/*.yml for all tests in alphabetical order.
  fixtures :all

  # Add more helper methods to be used by all tests here...
end

class ActionDispatch::IntegrationTest
  ROLE_NAMES = { 1 => 'manager', 2 => 'staff', 3 => 'user' }.freeze

  # ロール判定はrole_idで行うため、idを固定してロールを用意する
  def ensure_role(role_id)
    Role.find_by(id: role_id) || Role.create!(id: role_id, name: ROLE_NAMES.fetch(role_id))
  end

  def create_api_user(role_id:)
    User.create!(
      name: "api-test-user-#{role_id}",
      email: "api-test-user-#{SecureRandom.hex(4)}@example.com",
      password: 'password',
      password_confirmation: 'password',
      role: ensure_role(role_id)
    )
  end

  # authenticate_api_user! が必要なAPIを呼ぶための認証ヘッダー。
  # ロールによる制限を見ないテスト向けなので、既定は全APIを呼べるmanager（role_id 1）にする。
  def api_auth_headers(role_id: 1)
    @api_auth_headers ||= {}
    @api_auth_headers[role_id] ||= create_api_user(role_id: role_id).create_new_auth_token
  end
end
