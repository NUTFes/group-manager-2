# frozen_string_literal: true

require 'yaml'

class ApiAccessControlRegistry
  CATEGORIES = %w[participant staff manager].freeze
  UNAUTHENTICATED_AUTH_ACTIONS = %w[
    api/auth/registrations#create
    api/auth/sessions#index
    devise_token_auth/passwords#create
    devise_token_auth/passwords#edit
    devise_token_auth/passwords#new
    devise_token_auth/passwords#update
    devise_token_auth/sessions#create
    devise_token_auth/sessions#new
  ].freeze
  EXCLUDED_CONTROLLER_PREFIXES = %w[
    action_mailbox/
    active_storage/
    api/auth/
    devise_token_auth/
    rails/
  ].freeze

  attr_reader :config

  def initialize(path: Rails.root.join('config/api_access_control.yml'))
    @config = YAML.safe_load_file(path, aliases: false)
  end

  def classified_actions
    @classified_actions ||= CATEGORIES.each_with_object({}) do |category, actions|
      controllers_for(category).each do |controller, controller_actions|
        controller_actions.each do |action|
          key = action_key(controller, action)
          raise ArgumentError, "Duplicate access classification: #{key}" if actions.key?(key)

          actions[key] = category
        end
      end
    end
  end

  def unresolved_actions
    config.fetch('unresolved_routes', {}).keys.sort
  end

  def declared_actions
    classified_actions.keys.union(unresolved_actions).sort
  end

  def category_for(controller, action)
    return 'excluded' if excluded_controller?(controller)

    key = action_key(controller, action)
    return classified_actions.fetch(key) if classified_actions.key?(key)
    return 'unresolved' if unresolved_actions.include?(key)

    'unclassified'
  end

  def unauthenticated_auth_action?(controller, action)
    UNAUTHENTICATED_AUTH_ACTIONS.include?(action_key(controller, action))
  end

  def routed_actions
    Rails.application.routes.routes.filter_map do |route|
      controller = route.defaults[:controller].to_s
      action = route.defaults[:action].to_s
      next if controller.empty? || action.empty? || excluded_controller?(controller)

      action_key(controller, action)
    end.uniq.sort
  end

  def unresolvable_routed_actions
    routed_actions.reject do |key|
      controller, action = key.split('#', 2)
      controller_class = "#{controller.camelize}Controller".constantize
      controller_class.action_methods.include?(action)
    rescue NameError
      false
    end
  end

  private

  def controllers_for(category)
    config.fetch('access', {}).fetch(category, {})
  end

  def excluded_controller?(controller)
    EXCLUDED_CONTROLLER_PREFIXES.any? { |prefix| controller.start_with?(prefix) }
  end

  def action_key(controller, action)
    "#{controller}##{action}"
  end
end
