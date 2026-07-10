# frozen_string_literal: true

class Api::V1::OrderStatusCheckApiController < ApplicationController
  def get_order_status_check_for_admin_view
    @groups = Group.with_order_status_check(params[:id])
    render json: fmt(ok, @groups)
  end

  # admin_pageのviewの形に整える
  def fit_group_index_for_admin_view(groups)
    groups.map do |group|
      {
        group: group,
        user: group.user&.id,
        group_category: group.group_category&.id,
        fes_year: group.fes_year&.id,
        sub_rep: group.sub_rep&.id,
        place_order: group.place_order&.id,
        stage_orders: group.stage_orders.none? ? nil : group.stage_orders[0].id,
        stage_common_option: group.stage_common_option&.id,
        power_orders: group.power_orders.none? ? nil : group.power_orders[0].id,
        rental_orders: group.rental_orders.none? ? nil : group.rental_orders[0].id,
        employees: group.employees.none? ? nil : group.employees[0].id,
        food_product: group.food_products.empty? ? nil : true,
        purchase_list: if group.food_products.empty?
                         nil
                       else
                         group.food_products.any? { |food_product| !food_product.purchase_lists.empty? } ? true : nil
                       end,
        public_relation: group.public_relation&.id,
        venue_map: group.venue_map&.id,
        announcement: group.announcement&.status,
        cooking_process_order: group.cooking_process_order&.id,
        fire_equipment_order: group.fire_equipment_orders.none? ? nil : group.fire_equipment_orders[0].id,
        health_center_submission_statuses: group.health_center_submission_statuses.to_h { |s| [s.application_type, s.status] }
      }
    end
  end

  # 絞り込み機能
  def get_refinement_order_status_check
    fes_year_id = params[:fes_year_id].to_i
    group_category_id = params[:group_category_id].to_i
    is_international = params[:is_international].to_i
    is_external = params[:is_external].to_i # 0: 指定なし(ALL) 1: true 2: false

    @groups = Group.with_order_status_check_relations
    @groups = @groups.where(fes_year_id: fes_year_id) unless fes_year_id == 0
    @groups = @groups.where(group_category_id: group_category_id) unless group_category_id == 0
    @groups = @groups.where(is_international: is_international == 1) unless is_international == 0
    @groups = @groups.where(is_external: is_external == 1) unless is_external == 0

    if @groups.none?
      render json: fmt(not_found, [], 'Not found groups')
    else
      render json: fmt(ok, fit_group_index_for_admin_view(@groups))
    end
  end

  # あいまい検索機能
  def get_search_order_status_check
    word = params[:word]
    @groups = Group.with_order_status_check_relations.where('name LIKE ?', "%#{word}%")

    if @groups.none?
      render json: fmt(not_found, [], 'Not found groups')
    else
      render json: fmt(ok, fit_group_index_for_admin_view(@groups))
    end
  end
end
