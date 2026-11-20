# frozen_string_literal: true

class PlaceOrdersController < ApplicationController
  before_action :authenticate_api_user!
  before_action :set_place_order, only: %i[show update destroy]
  before_action :set_place_order_by_group_id, only: [:get_by_group_id]
  before_action :require_own_group!, only: %i[create update]

  # GET /place_orders
  # GET /place_orders.json
  def index
    @place_orders = own_place_orders_scope
    render json: fmt(ok, @place_orders)
  end

  # GET /place_orders/1
  # GET /place_orders/1.json
  def show
    render json: fmt(ok, @place_order)
  end

  # POST /place_orders
  # POST /place_orders.json
  def create
    @place_order = PlaceOrder.new(place_order_params)
    if @place_order.save
      render json: fmt(created, @place_order)
    else
      render_validation_errors(@place_order)
    end
  end

  # PATCH/PUT /place_orders/1
  # PATCH/PUT /place_orders/1.json
  def update
    if @place_order.update(place_order_params)
      render json: fmt(ok, @place_order, "Updated place_order id = #{params[:id]}")
    else
      render_validation_errors(@place_order)
    end
  end

  # DELETE /place_orders/1
  # DELETE /place_orders/1.json
  def destroy
    @place_order.destroy
    render json: fmt(ok, [], "Deletd place_order = #{params[:id]}")
  end

  # GET /place_orders/group_id/1
  def get_by_group_id
    render json: fmt(ok, @place_order)
  end

  private

  # 管理者は全団体、一般ユーザーは自団体のplace_orderのみを対象にする
  def own_place_orders_scope
    return PlaceOrder.all if admin_user?

    PlaceOrder.where(group_id: current_api_user.groups.select(:id))
  end

  # Use callbacks to share common setup or constraints between actions.
  def set_place_order
    @place_order = own_place_orders_scope.find_by(id: params[:id])
    @place_order || render(json: fmt(not_found, [], "Not found place_order = #{params[:id]}"))
  end

  # Use callbacks to share common setup or constraints between actions.
  def set_place_order_by_group_id
    @place_order = own_place_orders_scope.find_by(group_id: params[:group_id])
    @place_order || render(json: fmt(not_found, [], "Not found place_order = #{params[:group_id]}"))
  end

  # create/updateで指定されたgroup_idが自団体(管理者は全団体可)かを検証する
  def require_own_group!
    return if admin_user?

    group_id = params.dig(:place_order, :group_id)
    return if group_id.blank? # 未指定ならモデルの必須バリデーションに委ねる(updateでの部分更新も許可する)
    return if current_api_user.groups.exists?(id: group_id)

    render json: fmt({ code: 403, message: 'Forbidden' }, []), status: :forbidden
  end

  def admin_user?
    [1, 2].include?(current_api_user&.role_id)
  end

  # Only allow a list of trusted parameters through.
  def place_order_params
    params.require(:place_order).permit(:group_id, :first, :second, :third, :remark)
  end
end
