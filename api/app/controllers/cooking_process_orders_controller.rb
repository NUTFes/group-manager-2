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
      render json: fmt(not_found, [], "Not found cooking_process_orders for group_id = #{params[:group_id]}")
    end
  end

  # POST /cooking_process_orders
  def create
    attrs = cooking_process_order_params.to_h.symbolize_keys
    food_product = FoodProduct.find(params[:cooking_process_order][:food_product_id])
    attrs[:group_id] = food_product.group_id
    attrs = apply_tent_translation(attrs)

    @cooking_process_order = CookingProcessOrder.new(attrs)
    if @cooking_process_order.save
      render json: fmt(created, @cooking_process_order)
    else
      render json: fmt(error, @cooking_process_order)
    end
  end

  # PATCH/PUT /cooking_process_orders/1
  def update
    attrs = apply_tent_translation(
      cooking_process_order_params.to_h.symbolize_keys,
      existing: @cooking_process_order
    )
    @cooking_process_order.update(attrs)
    render json: fmt(created, @cooking_process_order, "Updated cooking process order id = #{params[:id]}")
  end

  # POST /cooking_process_orders/upsert
  def upsert
    keys = %i[
      id group_id food_product_id pre_open_kitchen during_open_kitchen
      tent tent_ja tent_source_hash created_at updated_at
    ]
    now = Time.current
    raw_orders = params[:cooking_process_orders].map(&:to_unsafe_h)
    existing_orders = existing_cooking_process_orders(raw_orders)

    upserts = raw_orders.map do |order|
      attrs = ActionController::Parameters
              .new(order)
              .permit(*keys)
              .to_h
              .symbolize_keys
      keys.each { |k| attrs[k] = nil unless attrs.key?(k) }
      attrs = apply_tent_translation(
        attrs,
        existing: existing_cooking_process_order_for(attrs, existing_orders),
        preserve_existing_translation: true
      )
      attrs[:created_at] ||= now
      attrs[:updated_at] = now
      attrs
    end

    CookingProcessOrder.upsert_all(upserts)

    # 更新／挿入されたレコードを取得して返却
    scopes = upserts.map do |attrs|
      if attrs[:id].present?
        CookingProcessOrder.where(id: attrs[:id])
      else
        CookingProcessOrder.where(
          group_id: attrs[:group_id],
          food_product_id: attrs[:food_product_id]
        )
      end
    end
    processed = scopes.reduce(CookingProcessOrder.none, &:or)

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
    params.require(:cooking_process_order).permit(
      :pre_open_kitchen,
      :during_open_kitchen,
      :tent,
      :tent_ja,
      :food_product_id
    )
  end

  def apply_tent_translation(attrs, existing: nil, preserve_existing_translation: false)
    return attrs unless attrs.key?(:tent)

    normalized_tent = attrs[:tent].to_s.strip
    current_hash = cooking_process_order_tent_hash(normalized_tent)
    attrs[:tent] = normalized_tent

    if existing&.tent_source_hash == current_hash
      if preserve_existing_translation
        attrs[:tent_ja] = existing.tent_ja unless tent_ja_provided?(attrs)
        attrs[:tent_source_hash] = existing.tent_source_hash
      end
      return attrs
    end

    attrs[:tent_source_hash] = current_hash
    attrs[:tent_ja] = translated_tent_ja(normalized_tent) unless tent_ja_provided?(attrs)
    attrs
  end

  def tent_ja_provided?(attrs)
    attrs.key?(:tent_ja) && attrs[:tent_ja].present?
  end

  def translated_tent_ja(tent)
    return nil if tent.blank?
    return nil unless translatable_english_text?(tent)

    translate_to_ja(tent)
  end

  def cooking_process_order_tent_hash(tent)
    Digest::SHA256.hexdigest(tent.to_s)
  end

  def existing_cooking_process_orders(raw_orders)
    ids = raw_orders.filter_map do |order|
      order['id'].presence || order[:id].presence
    end
    food_product_ids = raw_orders.filter_map do |order|
      order['food_product_id'].presence || order[:food_product_id].presence
    end

    records_by_id =
      CookingProcessOrder
      .where(id: ids)
      .index_by { |order| order.id.to_s }
    records_by_food_product_id =
      CookingProcessOrder
      .where(food_product_id: food_product_ids)
      .index_by { |order| order.food_product_id.to_s }

    {
      by_id: records_by_id,
      by_food_product_id: records_by_food_product_id
    }
  end

  def existing_cooking_process_order_for(attrs, existing_orders)
    if attrs[:id].present?
      existing_orders[:by_id][attrs[:id].to_s]
    elsif attrs[:food_product_id].present?
      existing_orders[:by_food_product_id][attrs[:food_product_id].to_s]
    end
  end
end
