# frozen_string_literal: true

namespace :api do
  desc 'Generate API stubs from OpenAPI specification using openapi-generator-cli'
  task :generate_stubs do
    puts '🚀 Starting API stub generation from OpenAPI spec...'

    # プロジェクトルートディレクトリ（Rakeタスク実行時のカレントディレクトリから取得）
    rails_root = Dir.pwd
    
    # 入力ファイルと出力ディレクトリの定義
    openapi_file = 'doc/openapi.yaml'
    output_dir = 'tmp/api_stub'
    
    # 出力ディレクトリが存在する場合は削除して再作成
    output_path = File.join(rails_root, output_dir)
    if Dir.exist?(output_path)
      puts "🗑️  Cleaning existing output directory: #{output_dir}"
      FileUtils.rm_rf(output_path)
    end
    
    # Docker経由でopenapi-generator-cliを実行
    docker_command = [
      'docker run --rm',
      "-v \"#{rails_root}:/local\"",
      'openapitools/openapi-generator-cli generate',
      "-i /local/#{openapi_file}",
      '-g ruby-on-rails',
      "-o /local/#{output_dir}"
    ].join(' ')
    
    puts "📦 Running openapi-generator-cli with Docker..."
    puts "   Input: #{openapi_file}"
    puts "   Output: #{output_dir}"
    puts "   Generator: ruby-on-rails"
    puts ''
    
    # コマンド実行
    system(docker_command)
    
    if $?.success?
      puts ''
      puts '✅ API stub generation completed successfully!'
      puts "📁 Generated files are in: #{output_dir}"
      puts ''
      puts '💡 Next steps:'
      puts "   1. Review the generated files in #{output_dir}"
      puts '   2. Copy necessary controllers and routes to your app'
      puts '   3. Customize the implementation as needed'
    else
      puts ''
      puts '❌ API stub generation failed!'
      puts 'Please check the error messages above.'
      exit 1
    end
  end
end
