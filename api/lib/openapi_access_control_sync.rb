# frozen_string_literal: true

require 'yaml'
require Rails.root.join('lib/api_access_control_registry')

class OpenapiAccessControlSync
  HTTP_METHODS = %w[get post put patch delete options head].freeze

  def initialize(
    document_path: Rails.root.join('oas_docs/dist/oas_doc.yml'),
    registry: ApiAccessControlRegistry.new
  )
    @document_path = document_path
    @registry = registry
  end

  def call
    document = YAML.safe_load_file(document_path, aliases: true)
    operation_categories = route_operation_categories

    document.fetch('paths', {}).delete_if do |path, path_item|
      HTTP_METHODS.each do |method|
        operation = path_item[method]
        next unless operation

        category = operation_categories[[path, method.upcase]]
        unless category
          path_item.delete(method)
          next
        end
        if category == 'unauthenticated_auth'
          operation['security'] = []
          next
        end
        next unless ApiAccessControlRegistry::CATEGORIES.include?(category)

        apply_access_contract(operation, category)
      end

      (path_item.keys & HTTP_METHODS).empty?
    end

    File.write(document_path, YAML.dump(document))
  end

  private

  attr_reader :document_path, :registry

  def route_operation_categories
    Rails.application.routes.routes.each_with_object({}) do |route, categories|
      controller = route.defaults[:controller].to_s
      action = route.defaults[:action].to_s
      next if controller.empty? || action.empty?

      path = route.path.spec.to_s
                  .sub('(.:format)', '')
                  .gsub(/:([a-zA-Z_]+)/, '{\1}')
      category = if registry.unauthenticated_auth_action?(controller, action)
                   'unauthenticated_auth'
                 else
                   registry.category_for(controller, action)
                 end
      route.verb.to_s.scan(/[A-Z]+/).each do |method|
        categories[[path, method]] = category
      end
    end
  end

  def apply_access_contract(operation, category)
    operation.delete('security')
    responses = operation['responses'] ||= {}
    responses['401'] ||= { 'description' => 'Unauthorized' }
    responses['403'] ||= { 'description' => 'Forbidden' } if %w[staff manager].include?(category)
    responses['404'] ||= { 'description' => 'Not Found' } if category == 'user'
  end
end
