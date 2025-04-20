class CheckAllRegisteredController < ApplicationController
  # GET /all_check_registered/:group_id
  def show
    group_id = params[:group_id]

    group = Group
              .includes(
                :sub_rep,
                :place_order,
                :stage_common_option,
                :power_orders,
                :employees,
                :public_relation,
                :venue_map,
                :cooking_process_order,
                stage_orders: [],
                food_products: :purchase_lists,
                rental_orders: []
              )
              .find(group_id)

    unregistered_types = UnRegisteredGroup
                           .where(group_id: group_id)
                           .pluck(:order_type)
                           .to_set

    statuses = {
      group:           present_or_unregistered?(group, unregistered_types, :group_application),
      sub_rep:         present_or_unregistered?(group.sub_rep, unregistered_types, :sub_rep_application),
      rental_item:     present_or_unregistered?(group.rental_orders.any?, unregistered_types, :rental_item_application),
      place_order:     present_or_unregistered?(group.place_order, unregistered_types, :place_order_application),
      stage_order:     present_or_unregistered?(group.stage_orders.any?, unregistered_types, :stage_order_application),
      stage_option:    present_or_unregistered?(group.stage_common_option, unregistered_types, :stage_option_application),
      power_order:     present_or_unregistered?(group.power_orders.any?, unregistered_types, :power_order_application),
      public_relation: present_or_unregistered?(group.public_relation, unregistered_types, :public_relation_application),
      employee:        present_or_unregistered?(group.employees.any?, unregistered_types, :employee_application),
      venue_map:       present_or_unregistered?(group.venue_map, unregistered_types, :venue_map_application),
      food_product:    present_or_unregistered?(group.food_products.any?, unregistered_types, :food_product_application),
      purchase_list:   present_or_unregistered?(group.food_products.any? { |fp| fp.purchase_lists.any? }, unregistered_types, :purchase_list_application),
      cooking_process: present_or_unregistered?(group.cooking_process_order, unregistered_types, :cooking_process_application),
      fire_usage:      present_or_unregistered?(false, unregistered_types, :fire_usage_application)
    }

    render json: fmt(:ok, statuses)
  rescue ActiveRecord::RecordNotFound
    render json: fmt(:not_found, [], "Not found group_id = #{group_id}")
  end

  private

  ORDER_TYPE_MAPPING = {
    sub_rep_application:           'sub_rep',
    rental_item_application:       'rental_item_order',
    power_order_application:       'power_order',
    public_relation_application:   'public_relation',
    employee_application:          'employee'
  }.with_indifferent_access.freeze


  def present_or_unregistered?(value_or_condition, unregistered_types, status_key)
    is_present = value_or_condition.respond_to?(:present?) ? value_or_condition.present? : !!value_or_condition
    mapped_order_type = ORDER_TYPE_MAPPING[status_key]
    is_present || (mapped_order_type && unregistered_types.include?(mapped_order_type)) || false
  end
end
