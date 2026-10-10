# frozen_string_literal: true

require 'test_helper'
require Rails.root.join('lib/api_access_control_registry')

class ApiAccessControlRegistryTest < ActiveSupport::TestCase
  self.fixture_table_names = []

  setup do
    @registry = ApiAccessControlRegistry.new
  end

  test 'every business route has an access classification or unresolved entry' do
    missing = @registry.routed_actions - @registry.declared_actions
    stale = @registry.declared_actions - @registry.routed_actions

    assert_empty missing, "Unclassified routes:\n#{missing.join("\n")}"
    assert_empty stale, "Routes no longer defined:\n#{stale.join("\n")}"
  end

  test 'unresolved entries match routes that cannot dispatch' do
    assert_equal @registry.unresolvable_routed_actions, @registry.unresolved_actions
    assert_empty @registry.classified_actions.keys & @registry.unresolved_actions
  end

  test 'access policy contains exactly the three supported role categories' do
    assert_equal 1, @registry.config.fetch('version')
    assert_equal(
      ApiAccessControlRegistry::CATEGORIES.sort,
      @registry.config.fetch('access').keys.sort
    )
    allowed = ApiAccessControlRegistry::CATEGORIES + ApiAccessControlRegistry::SELF_AUTHENTICATED_CATEGORIES
    assert(@registry.classified_actions.values.all? { |category| allowed.include?(category) })
  end

  test 'self authenticated actions are limited to the supported categories' do
    assert_equal(
      ApiAccessControlRegistry::SELF_AUTHENTICATED_CATEGORIES.sort,
      @registry.config.fetch('self_authenticated').keys.sort
    )
  end

  # ゲートを素通りするため、rental_bff区分のアクションには必ずBFF認証が掛かっていること
  test 'every rental bff action authenticates the rental bff' do
    actions = @registry.self_authenticated_actions('rental_bff')
    assert_not_empty actions

    actions.each do |key|
      controller, = key.split('#', 2)
      callbacks = "#{controller.camelize}Controller".constantize._process_action_callbacks.select do |callback|
        callback.kind == :before && callback.filter == :authenticate_rental_bff!
      end
      applies = callbacks.any? do |callback|
        callback.instance_variable_get(:@unless).empty? &&
          callback.instance_variable_get(:@if).empty?
      end
      assert applies, "#{key} must run authenticate_rental_bff!"
    end
  end

  test 'only authentication flow actions are marked unauthenticated' do
    assert @registry.unauthenticated_auth_action?('api/auth/registrations', 'create')
    assert @registry.unauthenticated_auth_action?('devise_token_auth/sessions', 'create')
    assert @registry.unauthenticated_auth_action?('devise_token_auth/passwords', 'create')
    assert_not @registry.unauthenticated_auth_action?('devise_token_auth/sessions', 'destroy')
    assert_not @registry.unauthenticated_auth_action?('news', 'index')
  end
end
