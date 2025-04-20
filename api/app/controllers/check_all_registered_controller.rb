class CheckAllRegisteredController < ApplicationController
  # GET /all_check_registered/:group_id
  def show
    group_id = params[:group_id]

    group = Group
              .includes(
                :group_category,
                :sub_rep,
                :place_order,
                :stage_common_option,
                :power_orders,
                :rental_orders,
                :employees,
                :public_relation,
                :venue_map,
                :announcement,
                :cooking_process_order,
                stage_orders: [],
                food_products: :purchase_lists
              )
              .find(group_id)

    # UnRegisteredGroupを1回のクエリで取得し、order_typeで検索しやすいようにSet化
    unregistered_types = UnRegisteredGroup
                           .where(group_id: group_id)
                           .pluck(:order_type)
                           .to_set

    # メインの登録状況チェック
    statuses = {
      group_category:        present_or_unregistered?(group.group_category, unregistered_types, 'group_category'),
      sub_rep:               present_or_unregistered?(group.sub_rep, unregistered_types, 'sub_rep'),
      place_order:           present_or_unregistered?(group.place_order, unregistered_types, 'place_order'),
      stage_orders:          present_or_unregistered?(group.stage_orders.any?, unregistered_types, 'stage_orders'),
      stage_common_option:   present_or_unregistered?(group.stage_common_option, unregistered_types, 'stage_common_option'),
      power_orders:          present_or_unregistered?(group.power_orders.any?, unregistered_types, 'power_orders'),
      rental_orders:         present_or_unregistered?(group.rental_orders.any?, unregistered_types, 'rental_orders'),
      employees:             present_or_unregistered?(group.employees.any?, unregistered_types, 'employees'),
      food_products:         present_or_unregistered?(group.food_products.any?, unregistered_types, 'food_products'),
      purchase_list:         present_or_unregistered?(group.food_products.any? { |fp| fp.purchase_lists.any? }, unregistered_types, 'purchase_list'),
      public_relation:       present_or_unregistered?(group.public_relation, unregistered_types, 'public_relation'),
      venue_map:             present_or_unregistered?(group.venue_map, unregistered_types, 'venue_map'),
      announcement:          present_or_unregistered?(group.announcement, unregistered_types, 'announcement'),
      cooking_process_order: present_or_unregistered?(group.cooking_process_order, unregistered_types, 'cooking_process_order'),
    }

    render json: fmt(:ok, statuses)
  rescue ActiveRecord::RecordNotFound
    render json: fmt(:not_found, [], "Not found group_id = #{group_id}")
  end

  private

  def present_or_unregistered?(value_or_condition, unregistered_types, order_type)
    is_present = value_or_condition.respond_to?(:present?) ? value_or_condition.present? : value_or_condition
    is_present || unregistered_types.include?(order_type)
  end
end
