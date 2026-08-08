# frozen_string_literal: true

class CheckAllRegisteredController < ApplicationController
  ORDER_TYPE_MAPPING = {
    sub_rep_application: 'sub_rep',
    rental_item_application: 'rental_item_order',
    power_order_application: 'power_order',
    fire_equipment_order_application: 'fire_equipment_order',
    employee_application: 'employee'
  }.with_indifferent_access.freeze

  # GET /all_check_registered/:group_id
  def show
    group_id = params[:group_id]

    group = current_api_user.groups
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
      group: group.present?,
      sub_rep: check_status(group.sub_rep, unregistered_types, :sub_rep_application),
      rental_item: check_status(group.rental_orders.any?, unregistered_types, :rental_item_application),
      place_order: group.place_order.present?,
      stage_order: group.stage_orders.any?,
      stage_option: group.stage_common_option.present?,
      power_order: check_status(group.power_orders.any?, unregistered_types, :power_order_application),
      employee: check_status(group.employees.any?, unregistered_types, :employee_application),
      venue_map: group.venue_map.present?,
      food_product: group.food_products.any?,
      purchase_list: group.food_products.any? { |fp| fp.purchase_lists.any? },
      cooking_process_order: group.cooking_process_order.present?,
      fire_equipment_order: check_status(group.fire_equipment_orders.any?, unregistered_types, :fire_equipment_order_application),
      public_relation: group.public_relation.present?
    }

    render json: fmt(:ok, statuses)
  rescue ActiveRecord::RecordNotFound
    render json: fmt(not_found, [], 'Not Found'), status: :not_found
  end

  private

  def present_or_unregistered?(value_or_condition, unregistered_types, status_key)
    is_present = value_or_condition.respond_to?(:present?) ? value_or_condition.present? : !value_or_condition.nil?
    mapped_order_type = ORDER_TYPE_MAPPING[status_key]
    is_present || (mapped_order_type && unregistered_types.include?(mapped_order_type)) || false
  end

  def check_status(value_or_condition, unregistered_types, status_key)
    if ORDER_TYPE_MAPPING.key?(status_key)
      present_or_unregistered?(value_or_condition, unregistered_types, status_key)
    else
      value_or_condition.respond_to?(:present?) ? value_or_condition.present? : !!value_or_condition
    end
  end
end
