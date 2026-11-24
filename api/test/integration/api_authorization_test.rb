# frozen_string_literal: true

require 'test_helper'

# ロールによるアクセス区分を固定する。
# - user以上（role_id 1, 2, 3）: USER_ACTIONS に載っている、userの画面から呼ばれるaction
# - staff以上（role_id 1, 2）  : それ以外の参照系action（管理画面の閲覧）
# - manager（role_id 1）      : それ以外の書き込み系action
# staffは閲覧専用のため、USER_ACTIONS のうち書き込み系も拒否される。
# SELF_ACTIONS（本人の情報の変更）は、ロールを問わず本人なら使える。
class ApiAuthorizationTest < ActionDispatch::IntegrationTest
  self.fixture_table_names = []

  # userの画面（user/）から呼ばれているaction
  USER_ACTIONS = {
    'groups' => %w[show create update get_user_group_id_and_group_category_id],
    'sub_reps' => %w[create update destroy get_by_group_id],
    'employees' => %w[create update destroy get_by_group upsert],
    'food_products' => %w[destroy group_food_products upsert],
    'purchase_lists' => %w[create update destroy get_by_food_product_id upsert_all],
    'cooking_process_orders' => %w[get_by_group_id upsert],
    'place_orders' => %w[create update get_by_group_id],
    'power_orders' => %w[get_by_group_id submit],
    'fire_equipment_orders' => %w[get_by_group_id submit],
    'rental_orders' => %w[create update destroy get_by_group_id],
    'stage_orders' => %w[create update get_by_group_id],
    'stage_common_options' => %w[create update get_by_group_id],
    'public_relations' => %w[create update get_by_group_id],
    'venue_maps' => %w[create update get_by_group_id],
    'un_registered_groups' => %w[create destroy group],
    'health_center_submission_statuses' => %w[index create update],
    'check_all_registered' => %w[show],
    'group_categories' => %w[index],
    'places' => %w[index],
    'shops' => %w[index],
    'stages' => %w[show_sunny show_rainy],
    'user_page_settings' => %w[index],
    'api/v1/current_user_api' => %w[get_current_user_with_user_detail],
    'api/v1/rental_items_api' => %w[get_all_rentable_items get_inside_shop_rentable_items get_outside_shop_rentable_items],
    'api/v1/fes_dates_api' => %w[get_current_fes_dates]
  }.freeze

  # 本人の情報を変更するaction。ロールの判定は掛けず、本人かどうかをactionごとに確認する
  SELF_ACTIONS = {
    'api/v1/current_user_api' => %w[edit_user_info password_reset],
    'api/v1/users' => %w[edit_user_info reset_password]
  }.freeze
  ROLE_FILTERS = %i[require_staff! require_manager! reject_staff_write!].freeze

  # 参照系とみなすaction名。検索・絞り込みはPOSTでも参照として扱う
  READ_ACTION_PATTERN = /\A(index|show|show_\w+|get_\w+|\w*search\w*|\w*refinement\w*|output_\w+|group|group_food_products|is_login|current_regist_info)\z/
  # 名前は参照系に見えるが、作成・編集の流れでしか使わないため書き込み系として扱うaction
  WRITE_ACTIONS = %w[api/v1/message_templates#copy_source rental_items#translate stocker_places#translate].freeze
  # 書き込み系を拒否されるロール（user・staff）
  NON_MANAGER_ROLE_IDS = [3, 2].freeze

  def self.user_action?(controller, action)
    USER_ACTIONS.fetch(controller, []).include?(action)
  end

  def self.self_action?(controller, action)
    SELF_ACTIONS.fetch(controller, []).include?(action)
  end

  def self.read_action?(target)
    WRITE_ACTIONS.exclude?(target) && READ_ACTION_PATTERN.match?(target.split('#').last)
  end

  # 指定したbefore_actionがそのactionで実行されるかを、only / except から判定する
  def self.callback_applies?(controller, action, filter)
    controller_class = "#{controller.camelize}Controller".constantize
    instance = controller_class.new
    instance.action_name = action

    controller_class._process_action_callbacks.any? do |callback|
      next false unless callback.kind == :before && callback.filter == filter

      callback.instance_variable_get(:@if).all? { |condition| condition.match?(instance) } &&
        callback.instance_variable_get(:@unless).none? { |condition| condition.match?(instance) }
    end
  end

  routes = ApiRouteList.authenticated_routes

  test 'USER_ACTIONS・SELF_ACTIONS に載っているactionはすべてルートに存在する' do
    targets = routes.map(&:last)
    missing = USER_ACTIONS.merge(SELF_ACTIONS).flat_map { |controller, actions| actions.map { |action| "#{controller}##{action}" } } - targets

    assert_empty missing
  end

  routes.each do |verb, path, target|
    controller, action = target.split('#')
    route_name = "#{verb.upcase} #{path} (#{target})"

    if self_action?(controller, action)
      test "#{route_name} は本人の情報の変更のため、ロールの判定が掛からない" do
        ROLE_FILTERS.each do |filter|
          assert_not self.class.callback_applies?(controller, action, filter), filter
        end
      end
    elsif user_action?(controller, action)
      test "#{route_name} はuser以上" do
        assert_not self.class.callback_applies?(controller, action, :require_staff!)
        assert_not self.class.callback_applies?(controller, action, :require_manager!)
      end

      next if read_action?(target)

      test "#{route_name} はuserの画面から呼ばれる書き込みのため、staffだと403" do
        assert self.class.callback_applies?(controller, action, :reject_staff_write!)

        send(verb, path, headers: api_auth_headers(role_id: 2), as: :json)

        assert_response :forbidden
      end
    elsif read_action?(target)
      test "#{route_name} はstaff以上（userだと403）" do
        assert self.class.callback_applies?(controller, action, :require_staff!)
        assert_not self.class.callback_applies?(controller, action, :require_manager!)

        send(verb, path, headers: api_auth_headers(role_id: 3), as: :json)

        assert_response :forbidden
      end
    else
      test "#{route_name} はmanagerのみ（user・staffだと403）" do
        assert self.class.callback_applies?(controller, action, :require_manager!)

        NON_MANAGER_ROLE_IDS.each do |role_id|
          send(verb, path, headers: api_auth_headers(role_id: role_id), as: :json)

          assert_response :forbidden, "role_id #{role_id}"
        end
      end
    end
  end
end
