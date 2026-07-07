# frozen_string_literal: true

class Api::V1::User::FireEquipmentOrdersController < ApplicationController
  before_action :authenticate_api_user!

  def resubmit
    group = current_user_group
    return render_not_found unless group

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
    render_not_found
  end

  private

  def current_user_group
    return nil if params[:group_id].blank?

    current_api_user.groups.find_by(id: params[:group_id])
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

  def render_not_found
    render json: fmt(not_found, [], 'fire_equipment_order not found'), status: :not_found
  end
end
