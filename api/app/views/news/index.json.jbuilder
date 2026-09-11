# frozen_string_literal: true

json.array! @news, partial: 'news/news', as: :news
