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

# Legacy scaffold controller tests predate API authentication. Tests backed by
# the default fixtures use the manager fixture automatically; access-control
# tests opt out by declaring an empty fixture table list and provide headers
# explicitly.
module AuthenticatedFixtureRequests
  %i[get post put patch delete].each do |request_method|
    define_method(request_method) do |path, **args|
      authenticate_fixture_request(args)
      super(path, **args)
    end
  end

  private

  def authenticate_fixture_request(args)
    return if self.class.fixture_table_names.empty? || args[:headers].present?

    fixture_user = User.find_by(email: 'fixture-manager@example.com')
    return unless fixture_user

    Role.find_or_create_by!(id: Role::MANAGER_ID) { |role| role.name = 'manager' }
    args[:headers] = fixture_user.create_new_auth_token
  end
end

ActionDispatch::IntegrationTest.prepend(AuthenticatedFixtureRequests)
