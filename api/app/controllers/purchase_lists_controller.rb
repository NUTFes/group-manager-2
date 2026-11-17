# frozen_string_literal: true

class PurchaseListsController < ApplicationController
  before_action :authenticate_api_user!
  before_action :require_accessible_food_product_ids!, only: %i[create update get_by_food_product_id]
  before_action :set_purchase_list, only: %i[show update destroy]

  # GET /purchase_lists
  def index
    @purchase_lists = accessible_purchase_lists
    render json: fmt(ok, @purchase_lists)
  end

  # GET /purchase_lists/1
  def show
    render json: fmt(ok, @purchase_list)
  end

  # POST /purchase_lists
  def create
    @purchase_list = PurchaseList.new(purchase_list_params)

    if @purchase_list.save
      render json: fmt(created, @purchase_list)
    else
      render_validation_errors(@purchase_list)
    end
  end

  # PATCH/PUT /purchase_lists/1
  def update
    if @purchase_list.update(purchase_list_params)
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
    @purchase_lists = PurchaseList.where(food_product_id: params[:food_product_ids])

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
      # nil補完（すべてのキーを明示的に持たせる）
      keys.each { |k| attrs[k] = nil unless attrs.key?(k) }
      attrs[:created_at] ||= now
      attrs[:updated_at] = now
      attrs
    end

    return render_forbidden unless accessible_purchase_list_records?(upsert)

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
    return @purchase_list = PurchaseList.find(params[:id]) if admin_user?

    @purchase_list = accessible_purchase_lists.find_by(id: params[:id])
    render_forbidden unless @purchase_list
  end

  # 購入品は販売品（food_product）を通して団体に紐づくため、自団体の販売品の購入品だけに絞る
  def accessible_purchase_lists
    return PurchaseList.all if admin_user?

    PurchaseList.where(food_product_id: scope_to_accessible_groups(FoodProduct.all).select(:id))
  end

  def accessible_food_product_ids?(food_product_ids)
    ids = Array(food_product_ids).compact_blank.map(&:to_s).uniq
    admin_user? || scope_to_accessible_groups(FoodProduct.all).where(id: ids).count == ids.size
  end

  # 指定されたfood_product_id（get_by_food_product_idではfood_product_ids）が自団体の販売品でなければ403にする
  def require_accessible_food_product_ids!
    return if accessible_food_product_ids?(params[:food_product_ids] || params[:food_product_id])

    render_forbidden
  end

  def accessible_purchase_list_records?(records)
    return true if admin_user?

    ids = records.filter_map { |attrs| attrs[:id].presence&.to_s }.uniq
    accessible_food_product_ids?(records.pluck(:food_product_id)) &&
      (ids.empty? || accessible_purchase_lists.where(id: ids).count == ids.size)
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
end
