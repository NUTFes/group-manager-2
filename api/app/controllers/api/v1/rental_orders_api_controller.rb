# frozen_string_literal: true

class Api::V1::RentalOrdersApiController < ApplicationController
  def get_rental_order_index_for_admin_view
    @rental_orders = RentalOrder.with_groups_and_rental_item
    render json: fmt(ok, @rental_orders)
  end

  def get_rental_order_show_for_admin_view
    @rental_order = RentalOrder.with_rental_item(params[:id])
    render json: fmt(ok, @rental_order)
  end

  def fit_rental_order_index_for_admin_view(rental_orders)
    rental_orders.map do |rental_order|
      {
        rental_order: rental_order,
        rental_item: rental_order.rental_item,
        group: rental_order.group
      }
    end
  end

  # 絞り込み機能
  def get_refinement_rental_orders
    fes_year_id = params[:fes_year_id].to_i
    rental_item_id = params[:rental_item_id].to_i
    group_category_id = params[:group_category_id].to_i

    @rental_orders = RentalOrder.preload(:group)

    @rental_orders = @rental_orders.joins(:group).where(groups: { fes_year_id: fes_year_id }) if fes_year_id != 0

    @rental_orders = @rental_orders.where(rental_item_id: rental_item_id) if rental_item_id != 0

    @rental_orders = @rental_orders.joins(:group).where(groups: { group_category_id: group_category_id }) if group_category_id != 0

    if @rental_orders.none?
      render json: fmt(not_found, [], 'Not found rental_orders')
    else
      render json: fmt(ok, fit_rental_order_index_for_admin_view(@rental_orders))
    end
  end

  # あいまい検索
  def get_search_rental_orders
    word = params[:word]
    @rental_orders = RentalOrder.preload(:group).select { |rental_order| rental_order.group.name.include?(word) }
    if @rental_orders.none?
      render json: fmt(not_found, [], 'Not found rental_orders')
    else
      render json: fmt(ok, fit_rental_order_index_for_admin_view(@rental_orders))
    end
  end

  # 申請一覧とその未割当
  def get_rental_orders_with_unassigned_num
    rental_item_id = params[:rental_item_id].to_i
    place_id = params[:place_id].to_i

    # rental_item_idが指定なし
    if rental_item_id == 0
      @rental_orders = RentalOrder.all

    # rental_item_idが指定
    elsif rental_item_id != 0
      @rental_orders = RentalOrder.where(rental_item_id: rental_item_id)
    end

    if @rental_orders.empty?
      render json: fmt(not_found, [], 'Not found stocker_items')
      return
    end

    @rental_orders = @rental_orders.includes(:rental_item, group: { place_order: { assign_group_places: :stocker_place } })
    assigned_nums = AssignRentalItem.where(group_id: @rental_orders.map(&:group_id), rental_item_id: @rental_orders.map(&:rental_item_id))
                                     .group(:group_id, :rental_item_id)
                                     .sum(:num)

    output = @rental_orders.filter_map do |rental_order|
      place_order = rental_order.group.place_order
      assign_group_places = place_order ? place_order.assign_group_places : []
      next if place_id != 0 && assign_group_places.none? { |assignment| assignment.stocker_place_id == place_id }

      unassigned_num = rental_order.num - assigned_nums.fetch([rental_order.group_id, rental_order.rental_item_id], 0)
      {
        id: rental_order.id,
        group_name: rental_order.group.name,
        assign_places: assign_group_places.map { |assignment| assignment.stocker_place.name }.presence || ['not yet'],
        rental_item: rental_order.rental_item.name,
        num: rental_order.num,
        unassigned_num: unassigned_num
      }
    end

    if place_id != 0 && output.empty?
      render json: fmt(not_found, [], 'Not found stocker_items')
    else
      render json: fmt(ok, output)
    end
  end
end
