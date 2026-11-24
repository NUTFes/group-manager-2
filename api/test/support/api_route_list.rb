# frozen_string_literal: true

# 認証・認可のテストで使う、devise_token_authのログインが必要なルートの一覧
module ApiRouteList
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
end
