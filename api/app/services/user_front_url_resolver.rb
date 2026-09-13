# frozen_string_literal: true

# userアプリ(参加団体向け確定情報ページ)の公開ドメインをAPP_ENVから解決する。
# user/next.config.ts, rental/next.config.tsと同じ「APP_ENVごとの固定マップ」方式に揃えている。
class UserFrontUrlResolver
  URLS_BY_ENV = {
    'development' => 'http://localhost:8003',
    'staging' => 'https://stg-group-manager.nutfes.net',
    'production' => 'https://group-manager.nutfes.net'
  }.freeze

  def self.call
    app_env = ENV.fetch('APP_ENV', nil)
    raise 'APP_ENV must be set' if app_env.blank?

    URLS_BY_ENV.fetch(app_env) do
      raise "Unsupported APP_ENV: #{app_env}"
    end
  end
end
