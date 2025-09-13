# frozen_string_literal: true

json.extract! news, :id, :title, :body, :created_at, :updated_at
json.url news_url(news, format: :json)
