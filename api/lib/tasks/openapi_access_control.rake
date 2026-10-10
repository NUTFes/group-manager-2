# frozen_string_literal: true

namespace :openapi do
  desc 'Synchronize OpenAPI security and authorization error responses'
  task sync_access_control: :environment do
    require Rails.root.join('lib/openapi_access_control_sync')

    OpenapiAccessControlSync.new.call
  end
end
