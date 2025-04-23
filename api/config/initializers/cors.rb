# Be sure to restart your server when you modify this file.

# Avoid CORS issues when API is called from the frontend app.
# Handle Cross-Origin Resource Sharing (CORS) in order to accept cross-origin AJAX requests.

# Read more: https://github.com/cyu/rack-cors

Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    # 全部のオリジンをちゃんとhttpつけて書くよ〜！
    origins 'http://192.168.97.3:8000', 'http://localhost:8000', 'http://localhost:8003', 'http://api:3000'
    # ↑↑↑ api:3000も追加したし、カンマも正しくしたし、httpもちゃんとつけた！💯

    resource '*',
      headers: :any,
      methods: [:get, :post, :put, :patch, :delete, :options, :head],
      credentials: true, # ←認証情報使うなら必須！
      expose: ['access-token', 'client', 'uid']
  end
end
