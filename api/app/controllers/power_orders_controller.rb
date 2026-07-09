# frozen_string_literal: true

class PowerOrdersController < ApplicationController
  before_action :authenticate_api_user!
  before_action :set_power_order, only: [:show]
  before_action :set_power_orders_by_group_id, only: [:get_by_group_id]

  # GET /power_orders
  # GET /power_orders.json
  def index
    @power_orders = PowerOrder.where(group_id: current_api_user.groups.select(:id))
    render json: fmt(ok, @power_orders)
  end

  # GET /power_orders/1
  # GET /power_orders/1.json
  def show
    render json: fmt(ok, @power_order)
  end

  # GET /power_orders/group_id/1
  def get_by_group_id
    render json: fmt(ok, @power_orders)
  end

  def submit
    group = current_user_group
    return render_submit_not_found unless group
    return render_submit_unprocessable_entity('use_power is required') unless params.key?(:use_power)
    return render_submit_unprocessable_entity('power_orders is required') if use_power? && power_order_params_list.empty?

    ActiveRecord::Base.transaction do
      if use_power?
        delete_unregistered_power_order(group)
        saved_ids = upsert_power_orders(group)
        delete_missing_power_orders(group, saved_ids)
      else
        group.power_orders.destroy_all
        ensure_unregistered_power_order(group)
      end

      HealthCenterSubmissionStatus.ensure_for_group_and_application_type!(
        group_id: group.id,
        application_type: :power_order,
        status: :unapproved
      )
    end

    render json: fmt(ok, group.power_orders.reload)
  rescue ActiveRecord::RecordInvalid => e
    render json: fmt(unprocessable_entity, [], e.record.errors.full_messages.join(', ')), status: :unprocessable_entity
  rescue ActiveRecord::RecordNotFound
    render_submit_not_found
  end

  private

  # Use callbacks to share common setup or constraints between actions.
  def set_power_order
    @power_order = PowerOrder
                   .where(group_id: current_api_user.groups.select(:id))
                   .find_by(id: params[:id])

    if @power_order
      @power_order
    else
      render json: fmt(not_found, [], "Not found power_order = #{params[:id]}")
    end
  end

  # Use callbacks to share common setup or constraints between actions.
  def set_power_orders_by_group_id
    group = current_user_group

    if group&.power_orders&.exists?
      @power_orders = group.power_orders
    else
      Rails.logger.debug 'PowerOrder.exists?(params[:group_id]) else'
      render json: fmt(not_found, [], "Not found power_order = #{params[:group_id]}")
    end
  end

  # Only allow a list of trusted parameters through.
  def current_user_group
    current_api_user_group(params[:group_id])
  end

  def use_power?
    ActiveModel::Type::Boolean.new.cast(params[:use_power])
  end

  def upsert_power_orders(group)
    power_order_params_list.map do |power_order_params|
      power_order = if power_order_params[:id].present?
                      group.power_orders.find_by(id: power_order_params[:id])
                    else
                      group.power_orders.build
                    end

      raise ActiveRecord::RecordNotFound if power_order.nil?

      power_order.assign_attributes(power_order_params.except(:id))
      power_order.save!
      power_order.id
    end
  end

  def delete_missing_power_orders(group, saved_ids)
    group.power_orders.where.not(id: saved_ids).destroy_all
  end

  def power_order_params_list
    params.fetch(:power_orders, []).map do |power_order|
      power_order.permit(:id, :item, :power, :manufacturer, :model, :item_url)
    end
  end

  def ensure_unregistered_power_order(group)
    UnRegisteredGroup.find_or_create_by!(
      group_id: group.id,
      order_type: :power_order
    )
  end

  def delete_unregistered_power_order(group)
    group.un_registered_groups.power_order.destroy_all
  end

  def render_submit_not_found
    render json: fmt(not_found, [], 'power_order not found'), status: :not_found
  end

  def render_submit_unprocessable_entity(message)
    render json: fmt(unprocessable_entity, [], message), status: :unprocessable_entity
  end
end
