class CheckAllRegisteredController < ApplicationController
    # GET /all_check_registered/:group_id
    def show
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
                .find(params[:group_id])

      statuses = {
        group_category:        group.group_category.present?,
        sub_rep:               group.sub_rep.present?,
        place_order:           group.place_order.present?,
        stage_orders:          group.stage_orders.any?,          # ← .any? は preloaded Array を見る
        stage_common_option:   group.stage_common_option.present?,
        power_orders:          group.power_orders.any?,
        rental_orders:         group.rental_orders.any?,
        employees:             group.employees.any?,
        food_products:         group.food_products.any?,
        purchase_list:         group.food_products.any? { |fp| fp.purchase_lists.any? },
        public_relation:       group.public_relation.present?,
        venue_map:             group.venue_map.present?,
        announcement:          group.announcement.present?,
        cooking_process_order: group.cooking_process_order.present?
      }

      render json: fmt(:ok, statuses)
    rescue ActiveRecord::RecordNotFound
      render json: fmt(:not_found, [], "Not found group_id = #{params[:group_id]}")
    end
  end
