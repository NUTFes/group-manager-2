class CheckAllRegisteredController < ApplicationController
# GET /all_check_registered/:group_id
def show
    group = Group.find(params[:group_id])

    statuses = {
    group_category:          group.group_category.present?,
    sub_rep:                 group.sub_rep.present?,
    place_order:             group.place_order.present?,
    stage_orders:            group.stage_orders.exists?,
    stage_common_option:     group.stage_common_option.present?,
    power_orders:            group.power_orders.exists?,
    rental_orders:           group.rental_orders.exists?,
    employees:               group.employees.exists?,
    food_products:           group.food_products.exists?,
    purchase_list:           group.food_products.any? { |fp| fp.purchase_lists.exists? },
    public_relation:         group.public_relation.present?,
    venue_map:               group.venue_map.present?,
    announcement:            group.announcement.present?,
    cooking_process_order:   group.cooking_process_order.present?
    }

    render json: fmt(:ok, statuses)

    rescue ActiveRecord::RecordNotFound
        render json: fmt(:not_found, [], "Not found group_id = "+params[:group_id])
    end
end
