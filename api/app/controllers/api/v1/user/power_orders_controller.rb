# frozen_string_literal: true

class Api::V1::User::PowerOrdersController < ApplicationController
  before_action :authenticate_api_user!

  def resubmit
    group = current_user_group
    return render_not_found unless group
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
    render_not_found
  end

  private

  def current_user_group
    return nil if params[:group_id].blank?

    current_api_user.groups.find_by(id: params[:group_id])
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

  def render_not_found
    render json: fmt(not_found, [], 'power_order not found'), status: :not_found
  end
end
