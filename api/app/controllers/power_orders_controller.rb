# frozen_string_literal: true

class PowerOrdersController < ApplicationController
  before_action :authenticate_api_user!, only: %i[resubmit destroy]
  before_action :set_power_order, only: %i[show update]
  before_action :set_power_orders_by_group_id, only: [:get_by_group_id]

  # GET /power_orders
  # GET /power_orders.json
  def index
    @power_orders = PowerOrder.all
    render json: fmt(ok, @power_orders)
  end

  # GET /power_orders/1
  # GET /power_orders/1.json
  def show
    render json: fmt(ok, @power_order)
  end

  # POST /power_orders
  # POST /power_orders.json
  def create
    @power_order = PowerOrder.create(power_order_params)
    render json: fmt(created, @power_order)
  end

  # PATCH/PUT /power_orders/1
  # PATCH/PUT /power_orders/1.json
  def update
    @power_order.update(power_order_params)
    render json: fmt(created, @power_order, "Updated power_order id = #{params[:id]}")
  end

  # GET /power_orders/group_id/1
  def get_by_group_id
    render json: fmt(ok, @power_orders)
  end

  def destroy
    power_order = user_power_order
    return render json: fmt(not_found, [], "Not found power_order = #{params[:id]}"), status: :not_found if power_order.nil?

    power_order.destroy
    render json: fmt(ok, [], "Deleted power_order = #{params[:id]}")
  end

  def resubmit
    group = current_user_group
    return render_resubmit_not_found unless group
    return render_invalid_resubmission_status unless waiting_resubmission?(group, :power_order)

    ActiveRecord::Base.transaction do
      if use_power?
        delete_unregistered_power_order(group)
        upsert_power_orders(group)
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
    render_resubmit_not_found
  end

  private

  # Use callbacks to share common setup or constraints between actions.
  def set_power_order
    if PowerOrder.exists?(params[:id])
      @power_order = PowerOrder.find(params[:id])
    else
      render json: fmt(not_found, [], "Not found power_order = #{params[:id]}")
    end
  end

  # Use callbacks to share common setup or constraints between actions.
  def set_power_orders_by_group_id
    if PowerOrder.exists?(group_id: params[:group_id])
      @power_orders = PowerOrder.where(group_id: params[:group_id])
    else
      Rails.logger.debug 'PowerOrder.exists?(params[:group_id]) else'
      render json: fmt(not_found, [], "Not found power_order = #{params[:group_id]}")
    end
  end

  # Only allow a list of trusted parameters through.
  def power_order_params
    params.permit(:group_id, :item, :power, :manufacturer, :model, :item_url)
  end

  def current_user_group
    return nil if params[:group_id].blank?

    current_api_user.groups.find_by(id: params[:group_id])
  end

  def user_power_order
    current_api_user
      .groups
      .joins(:power_orders)
      .find_by(power_orders: { id: params[:id] })
      &.power_orders
      &.find_by(id: params[:id])
  end

  def use_power?
    ActiveModel::Type::Boolean.new.cast(params[:use_power])
  end

  def upsert_power_orders(group)
    power_order_params_list.each do |power_order_params|
      power_order = if power_order_params[:id].present?
                      group.power_orders.find_by(id: power_order_params[:id])
                    else
                      group.power_orders.build
                    end

      raise ActiveRecord::RecordNotFound if power_order.nil?

      power_order.assign_attributes(power_order_params.except(:id))
      power_order.save!
    end
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

  def waiting_resubmission?(group, application_type)
    group.health_center_submission_statuses.find_by(application_type: application_type)&.waiting_resubmission?
  end

  def render_invalid_resubmission_status
    render json: fmt(unprocessable_entity, [], 'Status must be waiting_resubmission'), status: :unprocessable_entity
  end

  def render_resubmit_not_found
    render json: fmt(not_found, [], 'power_order not found'), status: :not_found
  end
end
