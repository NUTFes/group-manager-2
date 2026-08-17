# frozen_string_literal: true

class ItemRentalLogsController < ApplicationController
  # GET /item_rental_logs
  def index
    return render_unprocessable_entity('rental_place_id is required') if params[:rental_place_id].blank?

    rental_item_ids = AssignRentalItem.where(assign_rental_item_filter_params).distinct.pluck(:rental_item_id)

    render json: fmt(ok, ItemRentalLog.where(rental_item_id: rental_item_ids))
  end

  # POST /item_rental_logs
  def create
    existing_log = ItemRentalLog.find_by(uid: params[:uid])
    return render json: fmt(ok, existing_log) if existing_log

    return render_unprocessable_entity('Invalid category') unless valid_category?(params[:category])

    item_rental_log = ItemRentalLog.new(item_rental_log_params)
    item_rental_log.recorder_email = recorder_email

    if item_rental_log.save
      render json: fmt(created, item_rental_log), status: :created
    else
      render_validation_errors(item_rental_log)
    end
  rescue ActiveRecord::RecordNotUnique
    render json: fmt(ok, ItemRentalLog.find_by!(uid: params[:uid]))
  end

  private

  def valid_category?(category)
    ItemRentalLog.categories.key?(category.to_s)
  end

  def assign_rental_item_filter_params
    filter = { rental_place_id: params[:rental_place_id] }
    filter[:group_id] = params[:group_id] if params[:group_id].present?
    filter
  end

  def item_rental_log_params
    params.permit(:uid, :stocker_place_id, :rental_item_id, :category, :quantity)
  end

  def recorder_email
    request.headers['Cf-Access-Authenticated-User-Email']
  end

  def render_unprocessable_entity(message)
    render json: fmt(unprocessable_entity, [], message), status: :unprocessable_entity
  end
end
