# frozen_string_literal: true

require 'yaml'

# cloudflareのingress設定(cloudflare/{prod,stage}/config.yaml)を単一の情報源として、
# userアプリ(http://user:3000)の公開ドメインを解決する。
class UserFrontUrlResolver
  DEVELOPMENT_URL = 'http://localhost:8003'
  USER_SERVICE = 'http://user:3000'
  # compose.prod.ymlのapiサービスで `./cloudflare:/cloudflare:ro` としてマウントされている前提
  CONFIG_PATHS = {
    'production' => '/cloudflare/prod/config.yaml',
    'staging' => '/cloudflare/stage/config.yaml'
  }.freeze

  def self.call
    @result ||= new.call
  end

  def call
    return DEVELOPMENT_URL if app_env.blank? || !CONFIG_PATHS.key?(app_env)

    "https://#{hostname_from_cloudflare_config}"
  end

  private

  def app_env
    ENV.fetch('APP_ENV', nil)
  end

  def hostname_from_cloudflare_config
    ingress = YAML.safe_load_file(CONFIG_PATHS.fetch(app_env))['ingress']
    entry = ingress.find { |rule| rule['service'] == USER_SERVICE }
    entry.fetch('hostname')
  end
end
