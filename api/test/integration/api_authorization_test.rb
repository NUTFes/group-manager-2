# frozen_string_literal: true

require 'test_helper'

# ロールによるアクセス区分（user以上 / admin以上）を固定する。
# USER_ACTIONS に載っているactionだけが user（role_id 3）から呼べ、
# それ以外の認証必須actionはすべて admin以上（require_admin!）になっていることを確認する。
class ApiAuthorizationTest < ActionDispatch::IntegrationTest
  self.fixture_table_names = []

  # userの画面（user/）から呼ばれているaction
  USER_ACTIONS = {
    'groups' => %w[show create update get_user_group_id_and_group_category_id],
    'sub_reps' => %w[index show create update destroy get_by_group_id],
    'employees' => %w[index show create update destroy get_by_group upsert],
    'food_products' => %w[index show create update destroy group_food_products upsert],
    'purchase_lists' => %w[index show create update destroy get_by_food_product_id upsert_all],
    'cooking_process_orders' => %w[index show create update destroy get_by_group_id upsert],
    'place_orders' => %w[index show create update destroy get_by_group_id],
    'power_orders' => %w[show get_by_group_id submit],
    'fire_equipment_orders' => %w[index show get_by_group_id submit],
    'rental_orders' => %w[index show create update destroy get_by_group_id],
    'stage_orders' => %w[index show create update destroy get_by_group_id],
    'stage_common_options' => %w[index show create update destroy get_by_group_id],
    'public_relations' => %w[index show create update destroy get_by_group_id],
    'venue_maps' => %w[index show create update destroy get_by_group_id],
    'un_registered_groups' => %w[index show create update destroy group],
    'health_center_submission_statuses' => %w[index create update],
    'check_all_registered' => %w[show],
    'user_details' => %w[index show create update destroy],
    'group_categories' => %w[index show],
    'places' => %w[index show],
    'shops' => %w[index show],
    'stages' => %w[index show show_sunny show_rainy],
    'user_page_settings' => %w[index show],
    'api/v1/current_user_api' => %w[current_regist_info password_reset get_current_user_with_user_detail edit_user_info is_login],
    'api/v1/rental_items_api' => %w[get_all_rentable_items get_inside_shop_rentable_items get_outside_shop_rentable_items],
    'api/v1/fes_dates_api' => %w[get_current_fes_dates]
  }.freeze

  def self.user_action?(controller, action)
    USER_ACTIONS.fetch(controller, []).include?(action)
  end

  # require_admin! がそのactionで実行されるかを、before_actionの only / except から判定する
  def self.admin_required?(controller, action)
    controller_class = "#{controller.camelize}Controller".constantize
    instance = controller_class.new
    instance.action_name = action

    controller_class._process_action_callbacks.any? do |callback|
      next false unless callback.kind == :before && callback.filter == :require_admin!

      callback.instance_variable_get(:@if).all? { |condition| condition.match?(instance) } &&
        callback.instance_variable_get(:@unless).none? { |condition| condition.match?(instance) }
    end
  end

  routes = ApiRouteList.authenticated_routes

  test 'USER_ACTIONS に載っているactionはすべてルートに存在する' do
    targets = routes.map(&:last)
    missing = USER_ACTIONS.flat_map { |controller, actions| actions.map { |action| "#{controller}##{action}" } } - targets

    assert_empty missing
  end

  routes.each do |verb, path, target|
    controller, action = target.split('#')

    if user_action?(controller, action)
      test "#{verb.upcase} #{path} (#{target}) はuser以上（require_admin! が掛からない）" do
        assert_not self.class.admin_required?(controller, action)
      end
    else
      test "#{verb.upcase} #{path} (#{target}) はadmin以上（userだと403）" do
        assert self.class.admin_required?(controller, action)

        send(verb, path, headers: api_auth_headers(role_id: 3), as: :json)

        assert_response :forbidden
      end
    end
  end
end
