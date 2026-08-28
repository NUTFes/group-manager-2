# frozen_string_literal: true

class ItemRentalLogsController < ApplicationController
  before_action :authenticate_api_user!
  before_action :require_admin!

  IDEMPOTENCY_ATTRIBUTES = %w[
    assign_rental_item_id rental_item_id stocker_place_id category quantity
  ].freeze

  # GET /item_rental_logs
  def index
    assign_rental_items = AssignRentalItem.where(assign_rental_item_filter_params)
    item_rental_logs = ItemRentalLog.where(assign_rental_item_id: assign_rental_items.select(:id))

    render json: fmt(ok, { item_rental_logs: item_rental_logs, assign_rental_items: assign_rental_items })
  end

  # POST /item_rental_logs
  def create
    return render_unprocessable_entity('Invalid category') unless valid_category?(params[:category])

    assign_rental_item = AssignRentalItem.find_by(id: params[:assign_rental_item_id])
    return render_not_found('assign_rental_item not found') unless assign_rental_item

    item_rental_log = ItemRentalLog.new(
      item_rental_log_params.merge(
        rental_item_id: assign_rental_item.rental_item_id,
        stocker_place_id: assign_rental_item.stocker_place_id
      )
    )
    item_rental_log.recorder_email = current_api_user.email

    existing_log = ItemRentalLog.find_by(uid: item_rental_log.uid)
    return render_idempotent_result(existing_log, item_rental_log) if existing_log

    if item_rental_log.save
      render json: fmt(created, item_rental_log), status: :created
    else
      render_validation_errors(item_rental_log)
    end
  rescue ActiveRecord::RecordNotUnique
    existing_log = ItemRentalLog.find_by!(uid: item_rental_log.uid)
    render_idempotent_result(existing_log, item_rental_log)
  end

  private

  def valid_category?(category)
    ItemRentalLog.categories.key?(category.to_s)
  end

  def assign_rental_item_filter_params
    filter = {}
    filter[:rental_place_id] = params[:rental_place_id] if params[:rental_place_id].present?
    filter[:group_id] = params[:group_id] if params[:group_id].present?
    filter
  end

  def item_rental_log_params
    params.permit(:uid, :assign_rental_item_id, :category, :quantity)
  end

  def render_idempotent_result(existing_log, candidate_log)
    if same_event?(existing_log, candidate_log)
      render json: fmt(ok, existing_log)
    else
      render json: fmt(conflict, [], 'uid already exists with different event data'), status: :conflict
    end
  end

  def same_event?(existing_log, candidate_log)
    existing_log.attributes.slice(*IDEMPOTENCY_ATTRIBUTES) ==
      candidate_log.attributes.slice(*IDEMPOTENCY_ATTRIBUTES)
  end

  def render_unprocessable_entity(message)
    render json: fmt(unprocessable_entity, [], message), status: :unprocessable_entity
  end

  def render_not_found(message)
    render json: fmt(not_found, [], message), status: :not_found
  end
end
