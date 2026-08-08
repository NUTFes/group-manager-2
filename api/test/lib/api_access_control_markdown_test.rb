# frozen_string_literal: true

require 'test_helper'
require Rails.root.join('lib/api_access_control_markdown')

class ApiAccessControlMarkdownTest < ActiveSupport::TestCase
  self.fixture_table_names = []

  setup do
    @generator = ApiAccessControlMarkdown.new
    @markdown = @generator.render
  end

  test 'exports every classified route and unauthenticated authentication flow' do
    entries = @generator.route_entries

    assert(entries.any? { |entry| entry.category == 'authentication' })
    assert(entries.any? { |entry| entry.category == 'user' })
    assert(entries.any? { |entry| entry.category == 'staff' })
    assert(entries.any? { |entry| entry.category == 'manager' })

    entries.each do |entry|
      expected_row = "| `#{entry.http_method}` | `#{entry.path}` | `#{entry.action}` |"
      assert_includes @markdown, expected_row
    end
  end

  test 'documents the role hierarchy and denial responses' do
    assert_includes @markdown, 'user / staff / manager'
    assert_includes @markdown, 'staff / manager'
    assert_includes @markdown, '未認証401'
    assert_includes @markdown, 'userは403'
    assert_includes @markdown, 'user・staffは403'
    assert_includes @markdown, '団体所有権不一致404'
  end

  test 'contains representative routes from every category' do
    assert_includes @markdown, '| `POST` | `/api/auth` | `api/auth/registrations#create` |'
    assert_includes @markdown, '| `GET` | `/news` | `news#index` |'
    assert_includes @markdown, '| `GET` | `/api/v1/dashboard` | `api/v1/dashboard_api#get_dashboard_info` |'
    assert_includes @markdown, '| `PUT` | `/users/:id` | `users#update` |'
  end
end
