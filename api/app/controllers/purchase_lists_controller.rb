# frozen_string_literal: true

class PurchaseListsController < ApplicationController
  before_action :set_purchase_list, only: %i[show update destroy]

  # GET /purchase_lists
  def index
    @purchase_lists = PurchaseList.all
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
      render json: fmt(unprocessable_entity, [], @purchase_list.errors.full_messages.join(', ')), status: :unprocessable_entity
    end
  end

  # PATCH/PUT /purchase_lists/1
  def update
    if @purchase_list.update(purchase_list_params)
      render json: fmt(ok, @purchase_list, "Updated purchase_list id = #{params[:id]}")
    else
      render json: fmt(unprocessable_entity, [], @purchase_list.errors.full_messages.join(', ')), status: :unprocessable_entity
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
    @purchase_list = PurchaseList.find(params[:id])
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
