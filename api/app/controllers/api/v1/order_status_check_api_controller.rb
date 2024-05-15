class Api::V1::OrderStatusCheckApiController < ApplicationController

    def get_order_status_check_for_admin_view
      @groups = Group.with_order_status_check(params[:id])
      render json: fmt(ok, @groups)
    end

    # admin_pageのviewの形に整える
    def fit_group_index_for_admin_view(groups)
      groups.map{
        |group|
        {
          "group": group,
          "user": group.user.nil? ? nil: group.user.id,
          "group_category": group.group_category.nil? ? nil : group.group_category.id,
          "fes_year": group.fes_year.nil? ? nil : group.fes_year.id,
          "sub_rep": group.sub_rep.nil? ? nil : group.sub_rep.id,
          "place_order": group.place_order.nil? ? nil : group.place_order.id,
          "stage_orders": group.stage_orders.count == 0 ? nil : group.stage_orders[0].id,
          "stage_common_option": group.stage_common_option.nil? ? nil : group.stage_common_option.id,
          "power_orders": group.power_orders.count == 0 ? nil : group.power_orders[0].id,
          "rental_orders": group.rental_orders.count == 0 ? nil : group.rental_orders[0].id,
          "employees": group.employees.count == 0 ? nil : group.employees[0].id,
          "food_products": group.food_products.empty? ? nil :
            {
              "food_product": group.food_products.first.nil? ? nil : group.food_products.first.id,
              "purchase_lists": group.food_products.first.nil? || group.food_products.first.purchase_lists.empty? ? nil : group.food_products.first.purchase_lists[0].id
            },
          "public_relation": group.public_relation.nil? ? nil : group.public_relation.id,
          "venue_map": group.venue_map.nil? ? nil : group.venue_map.id,
          "announcement": group.announcement.nil? ? nil : group.announcement.status,
          "cooking_process_order": group.cooking_process_order.nil? ? nil : group.cooking_process_order.id
        }
      }
    end

    # 絞り込み機能
    def get_refinement_order_status_check
      fes_year_id = params[:fes_year_id].to_i
      group_category_id = params[:group_category_id].to_i
      is_international = params[:is_international].to_i
      is_external = params[:is_external].to_i

      option_list = [nil, true, false] # 0: 指定なし(ALL) 1: true 2: false

      @groups = Group.all
      @groups = @groups.where(fes_year_id: fes_year_id) unless fes_year_id == 0
      @groups = @groups.where(group_category_id: group_category_id) unless group_category_id == 0
      @groups = @groups.where(is_international: is_international == 1) unless is_international == 0
      @groups = @groups.where(is_external: is_external == 1) unless is_external == 0

      if @groups.count == 0
        render json: fmt(not_found, [], "Not found groups")
      else
        render json: fmt(ok, fit_group_index_for_admin_view(@groups))
      end
    end

    # あいまい検索機能
    def get_search_order_status_check
      word = params[:word]
      @groups = Group.with_order_status_check_narrow_down_by_search_word(word)
      if @groups.count == 0
        render json: fmt(not_found, [], "Not found groups")
      else
        render json: fmt(ok, @groups)
      end
    end

  end
