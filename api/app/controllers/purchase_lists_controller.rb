# frozen_string_literal: true

class PurchaseListsController < ApplicationController
  before_action :set_purchase_list, only: %i[show update destroy]

  # GET /purchase_lists
  def index
    @purchase_lists = current_user_purchase_lists
    render json: fmt(ok, @purchase_lists)
  end

  # GET /purchase_lists/1
  def show
    render json: fmt(ok, @purchase_list)
  end

  # POST /purchase_lists
  def create
    food_product = current_user_group_scope(FoodProduct).find_by(id: purchase_list_params[:food_product_id])
    return render_purchase_list_not_found unless food_product

    @purchase_list = PurchaseList.new(purchase_list_params.merge(food_product_id: food_product.id))

    if @purchase_list.save
      render json: fmt(created, @purchase_list)
    else
      render_validation_errors(@purchase_list)
    end
  end

  # PATCH/PUT /purchase_lists/1
  def update
    attrs = purchase_list_params
    return render_purchase_list_not_found if attrs[:food_product_id].present? && !current_user_group_scope(FoodProduct).exists?(id: attrs[:food_product_id])

    if @purchase_list.update(attrs)
      render json: fmt(ok, @purchase_list, "Updated purchase_list id = #{params[:id]}")
    else
      render_validation_errors(@purchase_list)
    end
  end

  # DELETE /purchase_lists/1
  def destroy
    @purchase_list.destroy
    render json: fmt(ok, [], "Deleted purchase_list = #{params[:id]}")
  end

  # GET /purchase_lists/food_product
  def get_by_food_product_id
    requested_ids = Array(params[:food_product_ids]).map(&:to_i)
    owned_ids = current_user_group_scope(FoodProduct).where(id: requested_ids).pluck(:id)
    return render_purchase_list_not_found unless owned_ids.sort == requested_ids.uniq.sort

    @purchase_lists = PurchaseList.where(food_product_id: owned_ids)

    if @purchase_lists.any?
      render json: fmt(ok, @purchase_lists)
    else
      render json: fmt(not_found, [], "Not found purchase_lists with food_product_ids = #{params[:food_product_ids]}")
    end
  end

  # POST /purchase_lists/upsert
  def upsert_all
    now = Time.current
    keys = %i[
      food_product_id shop_id fes_date_id
      items is_fresh purchase_date url remark created_at updated_at
    ]

    upsert = purchase_list_bulk_params.map do |attrs|
      food_product = current_user_group_scope(FoodProduct).find_by(id: attrs[:food_product_id])
      return render_purchase_list_not_found unless food_product
      return render_purchase_list_not_found if attrs[:id].present? && !current_user_purchase_lists.exists?(id: attrs[:id])

      attrs[:food_product_id] = food_product.id
      # nil補完（すべてのキーを明示的に持たせる）
      keys.each { |k| attrs[k] = nil unless attrs.key?(k) }
      attrs[:created_at] ||= now
      attrs[:updated_at] = now
      attrs
    end

    PurchaseList.upsert_all(upsert)
    # 登録または更新されたレコードを抽出
    scopes = upsert.map do |attrs|
      if attrs[:id].present?
        PurchaseList.where(id: attrs[:id])
      else
        PurchaseList.where(
          food_product_id: attrs[:food_product_id],
          shop_id: attrs[:shop_id],
          fes_date_id: attrs[:fes_date_id]
        )
      end
    end
    processed = scopes.reduce(PurchaseList.none, &:or)

    render json: fmt(created, processed)
  rescue StandardError => e
    render json: fmt(internal_server_error, [], e.message), status: :internal_server_error
  end

  private

  def set_purchase_list
    @purchase_list = current_user_purchase_lists.find_by(id: params[:id])
    render_purchase_list_not_found unless @purchase_list
  end

  # 一括登録・更新のStrong Parameters（upsert_all用）
  def purchase_list_bulk_params
    params.require(:purchase_lists).map do |p|
      ActionController::Parameters.new(p.to_unsafe_h).permit(
        :id,
        :food_product_id,
        :shop_id,
        :fes_date_id,
        :items,
        :is_fresh,
        :purchase_date,
        :url,
        :remark
      ).to_h.symbolize_keys
    end
  end

  # 単一レコード用のStrong Parameters
  def purchase_list_params
    params.permit(
      :food_product_id,
      :shop_id,
      :fes_date_id,
      :items,
      :is_fresh,
      :purchase_date,
      :url,
      :remark
    )
  end

  def current_user_purchase_lists
    PurchaseList
      .joins(:food_product)
      .where(food_products: { group_id: current_api_user.groups.select(:id) })
  end

  def render_purchase_list_not_found
    render json: fmt(not_found, [], 'Not Found'), status: :not_found
  end
end
