# frozen_string_literal: true

# Be sure to restart your server when you modify this file.

# Avoid CORS issues when API is called from the frontend app.
# Handle Cross-Origin Resource Sharing (CORS) in order to accept cross-origin AJAX requests.

# Read more: https://github.com/cyu/rack-cors

Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    if Rails.env.production?
      # 本番環境用のドメインたち✨
      origins 'https://group-manager.nutfes.net', 'https://group-manager-admin.nutfes.net'
    else
      # 開発環境用のローカルホスト系🔧
      origins 'http://localhost:8000', 'http://localhost:8003', 'http://localhost:8004',
              'http://localhost:3100', 'http://127.0.0.1:3100',
              'http://admin_view:8000', 'http://user:8003', 'http://swagger-ui:8004',
              'http://user:6006', 'http://localhost:6006', 'http://127.0.0.1:8000'# , 'http://172.28.227.232:8000'
    end

    resource '*',
             headers: :any,
             methods: %i[get post put patch delete options head],
             credentials: true, # ←認証情報使うなら必須！
             expose: %w[access-token client uid]
  end
end
