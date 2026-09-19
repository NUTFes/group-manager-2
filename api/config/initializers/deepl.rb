DeepL.configure do |config|
  config.auth_key = ENV['DEEPL_API_KEY']
  config.host = ENV['DEEPL_API_URL']
end