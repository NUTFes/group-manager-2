class PurchaseListsController < ApplicationController
  before_action :set_purchase_list, only: [:show, :update, :destroy]

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

  # GET /purchase_lists/group/:group_id
  def get_by_group_id
    @purchase_lists = PurchaseList.where(group_id: params[:group_id])

    if @purchase_lists.any?
      render json: fmt(ok, @purchase_lists)
    else
      render json: fmt(not_found, [], "Not found purchase_lists with group_id = #{params[:group_id]}")
    end
  end

 # POST /purchase_lists/upsert
def upsert_all
  now = Time.current
  keys = %i[
    group_id food_product_id shop_id fes_date_id
    items is_fresh purchase_date url created_at updated_at
  ]

  upserts = purchase_list_bulk_params.map do |attrs|
    # nil補完（すべてのキーを明示的に持たせる）
    keys.each { |k| attrs[k] = nil unless attrs.key?(k) }
    attrs[:created_at] ||= now
    attrs[:updated_at] = now
    attrs
  end

  PurchaseList.upsert_all(
    upserts,
    unique_by: %i[group_id food_product_id shop_id fes_date_id] # ユニークキーに合わせて変更
  )

  # 登録または更新されたレコードを抽出
  processed = upserts.map do |attrs|
    if attrs[:id].present?
      PurchaseList.where(id: attrs[:id])
    else
      PurchaseList.where(
        group_id: attrs[:group_id],
        food_product_id: attrs[:food_product_id],
        shop_id: attrs[:shop_id],
        fes_date_id: attrs[:fes_date_id]
      )
    end
  end.reduce { |acc, scope| acc.or(scope) }

  render json: fmt(created, processed)
rescue => e
  render json: fmt(internal_server_error, [], e.message), status: :internal_server_error
end
end

