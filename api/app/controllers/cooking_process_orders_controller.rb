# frozen_string_literal: true

class CookingProcessOrdersController < ApplicationController
  before_action :set_cooking_process_order, only: %i[show update destroy]

  # GET /cooking_process_orders
  def index
    @cooking_process_orders = CookingProcessOrder.all
    render json: @cooking_process_orders
  end

  # GET /cooking_process_orders/1
  def show
    render json: @cooking_process_order
  end

  # GET /cooking_process_orders/group/:group_id
  def get_by_group_id
    @cooking_process_orders = CookingProcessOrder.where(group_id: params[:group_id])
    if @cooking_process_orders.present?
      render json: fmt(ok, @cooking_process_orders)
    else
      render json: fmt(not_found, [], "Not found cooking_process_orders for group_id = "+params[:group_id])
    end
  end

  # POST /cooking_process_orders
  def create
    @cooking_process_order = CookingProcessOrder.new(cooking_process_order_params)
    food_product = FoodProduct.find(params[:cooking_process_order][:food_product_id])
    @cooking_process_order.group_id = food_product.group_id
    if @cooking_process_order.save
      render json: fmt(created, @cooking_process_order)
    else
      render json: fmt(error, @cooking_process_order)
    end
  end

  # PATCH/PUT /cooking_process_orders/1
  def update
    @cooking_process_order.update(cooking_process_order_params)
    render json: fmt(created, @cooking_process_order, "Updated cooking process order id = #{params[:id]}")
  end

  # POST /cooking_process_orders/upsert
  def upsert
    keys = [:id, :group_id, :food_product_id, :pre_open_kitchen, :during_open_kitchen, :tent, :created_at, :updated_at]
    now = Time.current

    upserts = params[:cooking_process_orders].map do |order|
      attrs = ActionController::Parameters
        .new(order.to_unsafe_h)
        .permit(*keys)
        .to_h
        .symbolize_keys
      keys.each { |k| attrs[k] = nil unless attrs.key?(k) }
      attrs[:created_at] ||= now
      attrs[:updated_at] = now
      attrs
    end

    CookingProcessOrder.upsert_all(upserts)

    # 更新／挿入されたレコードを取得して返却
    processed = upserts.map do |attrs|
      if attrs[:id].present?
        CookingProcessOrder.where(id: attrs[:id])
      else
        CookingProcessOrder.where(
          group_id: attrs[:group_id],
          food_product_id: attrs[:food_product_id]
        )
      end
    end.reduce { |acc, scope| acc.or(scope) }

    render json: fmt(ok, processed)
  rescue ActiveRecord::RecordInvalid => e
    render json: fmt(unprocessable_entity, [], e.record.errors.full_messages.join(', ')), status: :unprocessable_entity
  end

  # DELETE /cooking_process_orders/1
  def destroy
    @cooking_process_order.destroy
    render json: fmt(ok, [], "Deleted cooking process order id = #{params[:id]}")
  end

  private
  # Use callbacks to share common setup or constraints between actions
  def set_cooking_process_order
    @cooking_process_order = CookingProcessOrder.find(params[:id])
  rescue ActiveRecord::RecordNotFound
    render json: { error: 'Not found' }, status: :not_found
  end

  # Only allow a list of trusted parameters through
  def cooking_process_order_params
    params.require(:cooking_process_order).permit(:pre_open_kitchen, :during_open_kitchen, :tent, :food_product_id)
  end
end
