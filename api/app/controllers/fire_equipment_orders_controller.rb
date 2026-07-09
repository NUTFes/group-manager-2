# frozen_string_literal: true

class FireEquipmentOrdersController < ApplicationController
  before_action :authenticate_api_user!, only: %i[get_by_group_id submit]
  before_action :set_fire_equipment_order, only: [:show]
  before_action :set_fire_equipment_order_by_group_id, only: [:get_by_group_id]

  # GET /fire_equipment_orders
  def index
    fes_year_id = params[:fes_year_id]
    @fire_equipment_orders =
      if fes_year_id.present? && fes_year_id.to_i != 0
        FireEquipmentOrder.joins(:group).where(groups: { fes_year_id: fes_year_id })
      else
        FireEquipmentOrder.includes(:group).all
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
    order_with_fuel_japanese = @fire_equipment_order.as_json(include: { group: { only: %i[id name] } }).merge(
      fuel_japanese: @fire_equipment_order.fuel_japanese
    )
    render json: fmt(ok, order_with_fuel_japanese)
  end

  # GET /fire_equipment_orders/group/:group_id
  def get_by_group_id
    if @fire_equipment_order
      render json: fmt(ok, @fire_equipment_order)
    else
      render json: fmt(not_found, [], "Not found fire_equipment_order = #{params[:group_id]}")
    end
  end

  def submit
    group = current_user_group
    return render_submit_not_found unless group

    ActiveRecord::Base.transaction do
      fire_equipment_order = resolve_fire_equipment_order(group)
      fire_equipment_order.assign_attributes(fire_equipment_order_params_for_submit(group))
      fire_equipment_order.save!

      HealthCenterSubmissionStatus.ensure_for_group_and_application_type!(
        group_id: group.id,
        application_type: :fire_equipment_order,
        status: :unapproved
      )
    end

    render json: fmt(ok, group.fire_equipment_orders.reload.first)
  rescue ActiveRecord::RecordInvalid => e
    render json: fmt(unprocessable_entity, [], e.record.errors.full_messages.join(', ')), status: :unprocessable_entity
  rescue ActiveRecord::RecordNotFound
    render_submit_not_found
  end

  private

  def set_fire_equipment_order
    if FireEquipmentOrder.exists?(params[:id])
      @fire_equipment_order = FireEquipmentOrder.find(params[:id])
    else
      render json: fmt(not_found, [], "Not found fire_equipment_order = #{params[:id]}")
    end
  end

  def set_fire_equipment_order_by_group_id
    group = current_user_group

    if group&.fire_equipment_orders&.exists?
      @fire_equipment_order = group.fire_equipment_orders.first
    else
      render json: fmt(not_found, [], "Not found fire_equipment_order = #{params[:group_id]}")
    end
  end

  def fire_equipment_order_params
    params.require(:fire_equipment_order).permit(:name, :quantity, :fuel, :usage, :is_takeaway, :remark, :group_id)
  end

  def current_user_group
    group_id = params[:group_id].presence || params.dig(:fire_equipment_order, :group_id)
    return nil if group_id.blank?

    current_api_user.groups.find_by(id: group_id)
  end

  def resolve_fire_equipment_order(group)
    if params[:id].present?
      group.fire_equipment_orders.find_by(id: params[:id]).tap do |fire_equipment_order|
        raise ActiveRecord::RecordNotFound if fire_equipment_order.nil?
      end
    else
      group.fire_equipment_orders.first || group.fire_equipment_orders.build
    end
  end

  def fire_equipment_order_params_for_submit(group)
    return unregistered_fire_equipment_order_params(group) unless use_fire_equipment?

    source = params[:fire_equipment_order].presence || params
    source.permit(:name, :quantity, :fuel, :usage, :is_takeaway, :remark).merge(group_id: group.id)
  end

  def unregistered_fire_equipment_order_params(group)
    {
      group_id: group.id,
      name: '',
      quantity: 0,
      fuel: :gas_bottle,
      usage: '',
      is_takeaway: true,
      remark: ''
    }
  end

  def use_fire_equipment?
    ActiveModel::Type::Boolean.new.cast(params[:use_fire_equipment])
  end

  def render_submit_not_found
    render json: fmt(not_found, [], 'fire_equipment_order not found'), status: :not_found
  end
end
