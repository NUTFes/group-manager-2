# frozen_string_literal: true

class FoodProductsController < ApplicationController
  before_action :set_food_product, only: %i[show destroy]

  # GET /food_products
  def index
    @food_products = participant_scope(FoodProduct)
    render json: fmt(ok, @food_products)
  end

  # GET /group/:group_id/food_products
  def group_food_products
    group = current_api_user_group!(params[:group_id])
    return unless group

    @food_products = FoodProduct.where(group_id: group.id)
    render json: fmt(ok, @food_products)
  end

  # GET /food_products/1
  def show
    render json: fmt(ok, @food_product)
  end

  # POST /food_products
  # 単一レコード作成
  def create
    group = current_api_user_group!(food_product_params[:group_id])
    return unless group

    @food_product = FoodProduct.new(food_product_params.merge(group_id: group.id))
    if @food_product.save
      render json: fmt(created, @food_product)
    else
      render json: fmt(unprocessable_entity, [], @food_product.errors.full_messages.join(', ')), status: :unprocessable_entity
    end
  end

  # POST /food_products/upsert
  # 複数レコード作成・更新 (upsert_all使用)
  def upsert
    keys = %i[id group_id name is_cooking first_day_num second_day_num created_at updated_at is_alcohol]
    now = Time.current

    upserts = params[:food_products].map do |food_product|
      attrs = ActionController::Parameters
              .new(food_product.to_unsafe_h)
              .permit(*keys)
              .to_h
              .symbolize_keys
      keys.each { |k| attrs[k] = nil unless attrs.key?(k) }
      return render_food_product_not_found unless current_api_user.groups.exists?(id: attrs[:group_id])
      return render_food_product_not_found if attrs[:id].present? && !participant_scope(FoodProduct).exists?(id: attrs[:id])

      attrs[:created_at] ||= now
      attrs[:updated_at] = now
      attrs
    end

    FoodProduct.upsert_all(upserts)

    # 更新／挿入されたレコードを取得して返却
    scopes = upserts.map do |attrs|
      if attrs[:id].present?
        participant_scope(FoodProduct).where(id: attrs[:id])
      else
        participant_scope(FoodProduct).where(
          group_id: attrs[:group_id],
          name: attrs[:name],
          is_cooking: attrs[:is_cooking],
          first_day_num: attrs[:first_day_num],
          second_day_num: attrs[:second_day_num],
          is_alcohol: attrs[:is_alcohol]
        )
      end
    end
    processed = scopes.reduce(FoodProduct.none, &:or)

    render json: fmt(ok, processed)
  rescue ActiveRecord::RecordInvalid => e
    render json: fmt(unprocessable_entity, [], e.record.errors.full_messages.join(', ')), status: :unprocessable_entity
  end

  # PATCH/PUT /food_products/:id
  # 単一レコード更新
  def update
    @food_product = participant_record!(FoodProduct, params[:id])
    return unless @food_product

    attrs = food_product_params
    return if attrs[:group_id].present? && !current_api_user_group!(attrs[:group_id])

    if @food_product.update(attrs)
      render json: fmt(ok, @food_product, "Updated food_product id = #{params[:id]}")
    else
      error = @food_product&.errors
      errors_text = error&.full_messages&.join(', ') || 'Not found'
      render json: fmt(unprocessable_entity, [], errors_text), status: :unprocessable_entity
    end
  end

  # DELETE /food_products/1
  def destroy
    @food_product.destroy
    render json: fmt(ok, [], "Deleted food_product = #{params[:id]}")
  end

  private

  def set_food_product
    @food_product = participant_record!(FoodProduct, params[:id])
  end

  # 単一レコード用 Strong Parameters
  def food_product_params
    params.permit(:group_id, :name, :is_cooking, :first_day_num, :second_day_num, :is_alcohol)
  end

  def render_food_product_not_found
    render json: fmt(not_found, [], 'Not Found'), status: :not_found
  end
end
