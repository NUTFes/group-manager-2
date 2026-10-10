# frozen_string_literal: true

namespace :api_access_control do
  desc 'Export a Notion-ready Markdown list of API access permissions'
  task export_markdown: :environment do
    require Rails.root.join('lib/api_access_control_markdown')

    default_path = Rails.root.join('tmp/group-manager-api-access-control.md')
    output_path = ENV.fetch('OUTPUT_PATH', default_path)
    written_path = ApiAccessControlMarkdown.new.write(output_path)

    puts "Wrote #{written_path}"
  end
end
