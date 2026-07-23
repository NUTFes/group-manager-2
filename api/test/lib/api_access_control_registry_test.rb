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
    assert(
      @registry.classified_actions.values.all? do |category|
        ApiAccessControlRegistry::CATEGORIES.include?(category)
      end
    )
  end

  test 'only authentication flow actions are marked unauthenticated' do
    assert @registry.unauthenticated_auth_action?('api/auth/registrations', 'create')
    assert @registry.unauthenticated_auth_action?('devise_token_auth/sessions', 'create')
    assert @registry.unauthenticated_auth_action?('devise_token_auth/passwords', 'create')
    assert_not @registry.unauthenticated_auth_action?('devise_token_auth/sessions', 'destroy')
    assert_not @registry.unauthenticated_auth_action?('news', 'index')
  end
end
