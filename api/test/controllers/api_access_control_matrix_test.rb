# frozen_string_literal: true

require 'test_helper'
require Rails.root.join('lib/api_access_control_registry')

class ApiAccessControlMatrixTest < ActionDispatch::IntegrationTest
  self.fixture_table_names = []

  setup do
    Role.create!(id: Role::MANAGER_ID, name: 'manager')
    Role.create!(id: Role::STAFF_ID, name: 'staff')
    Role.create!(id: Role::USER_ID, name: 'user')

    @staff = create_user!('matrix-staff@example.com', Role::STAFF_ID)
    @user = create_user!('matrix-user@example.com', Role::USER_ID)
    @registry = ApiAccessControlRegistry.new
  end

  test 'every business route rejects unauthenticated requests' do
    routes_for(%w[user staff manager]).each do |route|
      request_route(route)

      assert_response :unauthorized, route_label(route)
    end
  end

  test 'every staff and manager route rejects users' do
    routes_for(%w[staff manager]).each do |route|
      request_route(route, headers: auth_headers(@user))

      assert_response :forbidden, route_label(route)
    end
  end

  test 'every manager route rejects staff' do
    routes_for(%w[manager]).each do |route|
      request_route(route, headers: auth_headers(@staff))

      assert_response :forbidden, route_label(route)
    end
  end

  private

  def routes_for(categories)
    Rails.application.routes.routes.select do |route|
      categories.include?(
        @registry.category_for(route.defaults[:controller].to_s, route.defaults[:action].to_s)
      )
    end
  end

  def request_route(route, headers: {})
    process(
      route.verb.downcase,
      materialized_path(route),
      headers: headers,
      as: :json
    )
  end

  def materialized_path(route)
    route.path.spec.to_s
         .delete_suffix('(.:format)')
         .gsub(/:([a-zA-Z_]+)/, '1')
         .gsub(/\*([a-zA-Z_]+)/, 'test')
  end

  def route_label(route)
    "#{route.verb} #{route.path.spec} -> " \
      "#{route.defaults[:controller]}##{route.defaults[:action]}"
  end

  def create_user!(email, role_id)
    User.create!(
      name: email.split('@').first,
      email: email,
      uid: email,
      provider: 'email',
      password: 'password',
      password_confirmation: 'password',
      role_id: role_id
    )
  end

  def auth_headers(user)
    user.create_new_auth_token
  end
end
