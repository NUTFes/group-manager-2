# frozen_string_literal: true

require 'test_helper'

class AllApplicationRoutesSmokeTest < ActionDispatch::IntegrationTest
  ROUTE_PARAM_VALUES = {
    id: 1,
    group_id: 1,
    user_id: 1,
    role_id: 1,
    fes_year_id: 1,
    food_product_id: 1
  }.freeze

  SKIPPED_CONTROLLERS = [
    'active_storage/',
    'action_mailbox/',
    'rails/',
    'print_pdf'
  ].freeze

  class << self
    def route_implemented?(route)
      controller = route.defaults[:controller].to_s
      klass = "#{controller.camelize}Controller".constantize
      klass.action_methods.include?(route.defaults[:action].to_s)
    rescue NameError, LoadError
      false
    end
  end

  setup do
    @auth_headers = users(:one).create_new_auth_token
  end

  Rails.application.routes.routes.each_with_index do |route, index|
    controller = route.defaults[:controller].to_s
    next if route.verb.blank? ||
            controller.blank? ||
            SKIPPED_CONTROLLERS.any? { |prefix| controller.start_with?(prefix) } ||
            !route_implemented?(route)

    define_method("test_route_#{index}_#{controller.tr('/', '_')}_#{route.defaults[:action]}") do
      exercise_route(route)
    end
  end

  private

  def exercise_route(route)
    method = request_method(route)
    path = concrete_path(route)
    params = params_for(route.defaults[:controller], route.defaults[:action])

    ActiveRecord::Base.connection.transaction(requires_new: true) do
      begin
        status, = Rails.application.call(rack_env(method, path, params))
        @last_status = status
      rescue StandardError => e
        flunk "#{failure_message(method, path, route)} raised #{e.class}: #{e.message}"
      end
      assert_operator @last_status, :<, 500, failure_message(method, path, route)
      raise ActiveRecord::Rollback
    end
  end

  def rack_env(method, path, params)
    env_options = {
      'HTTP_HOST' => 'www.example.com',
      'HTTP_ACCEPT' => 'application/json'
    }.merge(auth_env_headers)

    if %w[get delete].include?(method)
      Rack::MockRequest.env_for(path, env_options.merge(method: method.upcase, params: params))
    else
      Rack::MockRequest.env_for(
        path,
        env_options.merge(
          method: method.upcase,
          input: params.to_json,
          'CONTENT_TYPE' => 'application/json'
        )
      )
    end
  end

  def auth_env_headers
    @auth_headers.transform_keys do |key|
      "HTTP_#{key.upcase.tr('-', '_')}"
    end
  end

  def request_method(route)
    route.verb.to_s.delete('^A-Z|').split('|').first.downcase
  end

  def concrete_path(route)
    path = route.path.spec.to_s.delete_suffix('(.:format)')
    ROUTE_PARAM_VALUES.each do |key, value|
      path = path.gsub(":#{key}", value.to_s)
    end
    path
  end

  def failure_message(method, path, route)
    status = response&.status || 'no response'
    body = response&.body || ''
    status = @last_status if defined?(@last_status) && @last_status
    "#{method.upcase} #{path} (#{route.defaults[:controller]}##{route.defaults[:action]}) returned #{status}: #{body}"
  end

  def params_for(controller, action)
    base_params.merge(params_by_controller(controller)).merge(params_by_action(action))
  end

  def base_params
    {
      group_id: 1,
      user_id: 1,
      role_id: 1,
      fes_year_id: 1,
      group_category_id: 1,
      food_product_id: 1,
      food_product_ids: [1],
      rental_item_id: 1,
      stocker_item_id: 1,
      stocker_place_id: 1,
      place_id: 1,
      place_order_id: 1,
      stage_id: 1,
      stage_order_id: 1,
      group_identification_id: 1,
      department_id: 1,
      grade_id: 1,
      shop_id: 1,
      fes_date_id: 1,
      health_center_submission_status_id: 1,
      application_type: 'food_product',
      status: 'approved',
      body: 'body',
      keyword: 'MyString',
      word: 'MyString',
      text: 'MyString',
      name: 'MyString',
      name_en: 'MyString',
      email: 'user-one@example.com',
      password: 'password',
      password_confirmation: 'password',
      student_id: 12_345_678,
      tel: '09012345678',
      number: 1,
      num: 1,
      max_num: 1,
      item: 'MyString',
      items: 'MyString',
      power: 1,
      quantity: 1,
      manufacturer: 'MyString',
      model: 'MyString',
      first: 1,
      second: 1,
      third: 1,
      remark: 'MyString',
      title: 'MyString',
      content: 'MyString',
      message: 'MyString',
      picture_name: 'MyString',
      picture_path: 'MyString',
      blurb: 'MyString',
      is_fresh: false,
      is_cooking: false,
      is_sunny: false,
      enable: false,
      enable_sunny: true,
      enable_rainy: true,
      first_day_num: 1,
      second_day_num: 1,
      own_equipment: false,
      bgm: false,
      camera_permission: false,
      loud_sound: false,
      pre_open_kitchen: false,
      during_open_kitchen: false,
      tent: 'MyString',
      is_inside_shop_rentable: false,
      is_outside_shop_rentable: false,
      is_stage_rentable: false
    }
  end

  def params_by_controller(controller)
    case controller
    when 'assign_rental_items'
      {
        rentalItemId: 1,
        stockerPlaceId: 1,
        items: [{ group_id: 1, num: 1 }]
      }
    when 'purchase_lists'
      { purchase_lists: [{ id: 1, food_product_id: 1, shop_id: 1, fes_date_id: 1, items: 'MyString', is_fresh: false }] }
    when 'food_products'
      { food_products: [{ id: 1, group_id: 1, name: 'MyString', is_cooking: false, first_day_num: 1, second_day_num: 1 }] }
    when 'employees'
      { employees: [{ id: 1, group_id: 1, name: 'MyString', student_id: 1, stool_test_id: 1 }] }
    when 'cooking_process_orders'
      { cooking_process_orders: [{ id: 1, group_id: 1, food_product_id: 1, pre_open_kitchen: false, during_open_kitchen: false, tent: 'MyString' }] }
    when 'contact_persons'
      { contact_person: { group_id: 1, name: 'MyString', email: 'contact@example.com' } }
    else
      {}
    end
  end

  def params_by_action(action)
    case action
    when 'get_refinement_groups', 'get_search_groups',
         'get_refinement_power_orders', 'get_search_power_orders',
         'get_refinement_place_orders', 'get_search_place_orders',
         'get_refinement_rental_orders', 'get_search_rental_orders',
         'get_refinement_stage_orders', 'get_search_stage_orders',
         'get_refinement_stage_common_options', 'get_search_stage_common_options',
         'get_refinement_employees', 'get_search_employees',
         'get_refinement_food_products', 'get_search_food_products',
         'get_refinement_purchase_lists', 'get_search_purchase_lists',
         'get_refinement_public_relations', 'get_search_public_relations',
         'get_refinement_venue_maps', 'get_search_venue_maps',
         'get_refinement_announcements', 'get_search_announcements',
         'get_refinement_cooking_process_orders', 'get_search_cooking_process_orders',
         'get_refinement_order_infos', 'get_search_order_infos',
         'get_refinement_order_status_check', 'get_search_order_status_check',
         'get_refinement_users', 'get_search_users',
         'get_refinement_represantatives', 'get_search_representatives',
         'get_search_sub_reps'
      {
        fes_year_id: 1,
        group_category_id: 1,
        category_id: 0,
        days_num: 0,
        stage_id: 0,
        is_cooking: 0,
        is_fresh: 0,
        is_sunny: 0,
        own_equipment: 0,
        bgm: 0,
        camera_permission: 0,
        loud_sound: 0,
        word: 'MyString',
        keyword: 'MyString'
      }
    else
      {}
    end
  end
end
