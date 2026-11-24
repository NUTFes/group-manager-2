# frozen_string_literal: true

require 'test_helper'

# 全ルートについて、未ログインのリクエストが401になることを確認する。
# ログイン不要として意図的に公開しているAPIと、別の仕組みで認証するAPIだけを除外する。
class ApiAuthenticationTest < ActionDispatch::IntegrationTest
  self.fixture_table_names = []

  def self.authenticated_routes
    ApiRouteList.authenticated_routes
  end

  authenticated_routes.each do |verb, path, target|
    test "#{verb.upcase} #{path} (#{target}) は未ログインだと401になる" do
      send(verb, path, as: :json)

      assert_response :unauthorized
    end
  end

  test '未ログインでもお知らせ一覧を取得できる' do
    get news_index_url, as: :json

    assert_response :success
  end

  test '未ログインでもsecretが一致しない確定情報は404になる（401にはならない）' do
    get '/api/v1/get_confirmed_info_for_user_view/1', params: { secret: 'invalid' }, as: :json

    assert_response :not_found
  end

  test 'ログイン済みなら認証が必要なAPIを呼べる' do
    get groups_url, headers: api_auth_headers, as: :json

    assert_response :success
  end
end
