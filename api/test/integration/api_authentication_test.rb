# frozen_string_literal: true

require 'test_helper'

# 全ルートについて、未ログインのリクエストが401になることを確認する。
# ログイン不要として意図的に公開しているAPIと、別の仕組みで認証するAPIだけを除外する。
class ApiAuthenticationTest < ActionDispatch::IntegrationTest
  self.fixture_table_names = []

  # ログインせずに呼べるAPI（controller#action）
  PUBLIC_ACTIONS = %w[
    news#index
    api/auth/sessions#index
    api/v1/confirmed_infos_api#get_confirmed_info_for_user_view
    api/v1/confirmed_qrcodes_api#get_confirmed_qrcode_for_user_view
  ].freeze

  # devise_token_authではなくrental BFFのトークンで認証するcontroller
  RENTAL_BFF_CONTROLLERS = %w[
    item_rental_logs
    api/v1/rental_records_api
  ].freeze

  # devise_token_auth自身のcontroller（ログイン・新規登録など）
  AUTH_CONTROLLER_PREFIXES = %w[devise_token_auth/ api/auth/].freeze

  def self.authenticated_routes
    Rails.application.routes.routes.filter_map do |route|
      controller = route.defaults[:controller]
      action = route.defaults[:action]
      next if controller.blank? || action.blank?
      next if controller.start_with?('rails/', 'active_storage/', 'action_mailbox/', 'letter_opener_web')
      next if AUTH_CONTROLLER_PREFIXES.any? { |prefix| controller.start_with?(prefix) }
      next if RENTAL_BFF_CONTROLLERS.include?(controller)
      next if PUBLIC_ACTIONS.include?("#{controller}##{action}")
      # ルートだけ残っていてcontrollerやactionが存在しないものは対象外（#2251で整理する）
      next unless routable?(controller, action)

      verb = route.verb.split('|').first.downcase
      path = route.path.spec.to_s.sub('(.:format)', '').gsub(/:\w+/, '1')
      [verb, path, "#{controller}##{action}"]
    end.uniq
  end

  def self.routable?(controller, action)
    "#{controller.camelize}Controller".constantize.action_methods.include?(action)
  rescue NameError
    false
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
