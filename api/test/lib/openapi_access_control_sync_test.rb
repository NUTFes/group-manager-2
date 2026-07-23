# frozen_string_literal: true

require 'test_helper'
require 'tempfile'
require Rails.root.join('lib/openapi_access_control_sync')

class OpenapiAccessControlSyncTest < ActiveSupport::TestCase
  self.fixture_table_names = []

  test 'documents public and protected operations according to the registry' do
    document = {
      'paths' => {
        '/news' => { 'get' => { 'responses' => { '200' => { 'description' => 'OK' } } } },
        '/announcements' => { 'get' => { 'responses' => {} } },
        '/groups' => { 'get' => { 'responses' => {} } },
        '/users/{id}' => { 'put' => { 'responses' => {} } },
        '/removed-route' => { 'get' => { 'responses' => {} } }
      }
    }

    Tempfile.create(['openapi', '.yml']) do |file|
      file.write(YAML.dump(document))
      file.flush

      OpenapiAccessControlSync.new(document_path: Pathname(file.path)).call
      synced = YAML.safe_load_file(file.path, aliases: true).fetch('paths')

      assert_equal [], synced.dig('/news', 'get', 'security')
      assert synced.dig('/announcements', 'get', 'responses').key?('401')
      assert synced.dig('/announcements', 'get', 'responses').key?('404')
      assert synced.dig('/groups', 'get', 'responses').key?('403')
      assert synced.dig('/users/{id}', 'put', 'responses').key?('403')
      assert_not synced.key?('/removed-route')
    end
  end

  test 'generated document contains the access contract for every business route' do
    sync = OpenapiAccessControlSync.new
    route_categories = sync.send(:route_operation_categories).select do |_operation, category|
      ApiAccessControlRegistry::CATEGORIES.include?(category)
    end
    paths = YAML.safe_load_file(Rails.root.join('oas_docs/dist/oas_doc.yml'), aliases: true).fetch('paths')
    role_restricted_categories = %w[staff manager]

    route_categories.each do |(path, method), category|
      operation = paths.dig(path, method.downcase)
      assert operation, "OpenAPI operation missing: #{method} #{path}"

      if category == 'public'
        assert_equal [], operation['security'], "Public security mismatch: #{method} #{path}"
      else
        assert operation.fetch('responses').key?('401'), "401 missing: #{method} #{path}"
      end
      assert operation.fetch('responses').key?('403'), "403 missing: #{method} #{path}" if role_restricted_categories.include?(category)
      assert operation.fetch('responses').key?('404'), "404 missing: #{method} #{path}" if category == 'participant'
    end
  end
end
