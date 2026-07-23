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

  test 'all classified routes use a supported category' do
    assert_equal 1, @registry.config.fetch('version')
    assert_empty @registry.config.fetch('access').keys - ApiAccessControlRegistry::CATEGORIES
    assert(
      @registry.classified_actions.values.all? do |category|
        ApiAccessControlRegistry::CATEGORIES.include?(category)
      end
    )
  end
end
