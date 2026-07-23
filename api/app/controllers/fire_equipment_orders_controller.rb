# frozen_string_literal: true

class FireEquipmentOrdersController < ApplicationController
  before_action :authenticate_api_user!

  # GET /fire_equipment_orders
  def index
    fes_year_id = params[:fes_year_id]
    owned_orders = participant_scope(FireEquipmentOrder)
    @fire_equipment_orders = if fes_year_id.present? && fes_year_id.to_i != 0
                               owned_orders.joins(:group).where(groups: { fes_year_id: fes_year_id })
                             else
                               owned_orders.includes(:group)
                             end
    orders_with_fuel_japanese = @fire_equipment_orders.map do |order|
      order.as_json(include: { group: { only: %i[id name] } }).merge(
        fuel_japanese: order.fuel_japanese
      )
    end
    render json: fmt(ok, orders_with_fuel_japanese)
  end

  # GET /fire_equipment_orders/:id
  def show
    fire_equipment_order = FireEquipmentOrder
                           .where(group_id: current_api_user.groups.select(:id))
                           .find_by(id: params[:id])
    return render_submit_not_found if fire_equipment_order.nil?

    order_with_fuel_japanese = fire_equipment_order.as_json(include: { group: { only: %i[id name] } }).merge(
      fuel_japanese: fire_equipment_order.fuel_japanese
    )
    render json: fmt(ok, order_with_fuel_japanese)
  end

  # GET /fire_equipment_orders/group/:group_id
  def get_by_group_id
    group = current_api_user_group!(params[:group_id])
    return unless group

    orders = group.fire_equipment_orders.order(:id)
    render json: fmt(ok, orders)
  end

  # PUT/PATCH /fire_equipment_orders/submit
  # fire_equipment_orders が空配列の場合は、そのグループの火気使用申請を全件削除する
  # （火気を使用しない申請への切り替え、または最後の1件を削除するケース）。
  def submit
    group = current_user_group
    return render_submit_not_found unless group

    ActiveRecord::Base.transaction do
      delete_unregistered_fire_equipment_order(group)
      saved_ids = upsert_fire_equipment_orders(group)
      delete_missing_fire_equipment_orders(group, saved_ids)

      HealthCenterSubmissionStatus.ensure_for_group_and_application_type!(
        group_id: group.id,
        application_type: :fire_equipment_order,
        status: :unapproved
      )
    end

    render json: fmt(ok, group.fire_equipment_orders.reload)
  rescue ActiveRecord::RecordInvalid => e
    render json: fmt(unprocessable_entity, [], e.record.errors.full_messages.join(', ')), status: :unprocessable_entity
  rescue ActiveRecord::RecordNotFound
    render_submit_not_found
  end

  private

  def current_user_group
    current_api_user_group(params[:group_id])
  end

  def upsert_fire_equipment_orders(group)
    fire_equipment_order_params_list.map do |item_params|
      fire_equipment_order = if item_params[:id].present?
                               group.fire_equipment_orders.find_by(id: item_params[:id])
                             else
                               group.fire_equipment_orders.build
                             end

      raise ActiveRecord::RecordNotFound if fire_equipment_order.nil?

      fire_equipment_order.assign_attributes(item_params.except(:id))
      fire_equipment_order.save!
      fire_equipment_order.id
    end
  end

  def delete_missing_fire_equipment_orders(group, saved_ids)
    group.fire_equipment_orders.where.not(id: saved_ids).destroy_all
  end

  def fire_equipment_order_params_list
    params.fetch(:fire_equipment_orders, []).map do |item|
      item.permit(:id, :name, :quantity, :fuel, :usage, :is_takeaway, :remark)
    end
  end

  def delete_unregistered_fire_equipment_order(group)
    group.un_registered_groups.fire_equipment_order.destroy_all
  end

  def render_submit_not_found
    render json: fmt(not_found, [], 'fire_equipment_order not found'), status: :not_found
  end
end
