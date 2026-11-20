# frozen_string_literal: true

class RentalItemsController < ApplicationController
  before_action :set_rental_item, only: %i[show update destroy]

  def index
    @rental_items = RentalItem.all
    render json: fmt(ok, @rental_items)
  end

  def show
    render json: fmt(ok, @rental_item)
  end

  def create
    params[:name_en] = translate_to_en(params[:name]) if params[:name_en].blank?
    @rental_item = RentalItem.new(rental_item_params)
    if @rental_item.save
      render json: fmt(created, @rental_item)
    else
      render_rental_item_errors
    end
  end

  def update
    # name を伴わない部分更新（貸出可否フラグだけの変更など）では name_en に触らない。
    # translate_to_en(nil) の nil をそのまま入れると既存の英語名が黙って消えるため。
    params[:name_en] = translate_to_en(params[:name]) if params[:name_en].blank? && params[:name].present?
    if @rental_item.update(rental_item_params)
      render json: fmt(created, @rental_item, "Updated rental_item id = #{params[:id]}")
    else
      render_rental_item_errors
    end
  end

  def destroy
    if @rental_item.destroy
      render json: fmt(ok, [], "Deleted rental_item = #{params[:id]}")
    else
      render json: fmt(conflict, [], @rental_item.errors.full_messages.join(', ')), status: :conflict
    end
  end

  def translate
    translated = translate_to_en(params[:text])
    render json: fmt(ok, { name_en: translated })
  end

  private

  # 保存に失敗したときは成功扱い（201）で返さず、理由を添えて422にする
  def render_rental_item_errors
    render json: fmt(unprocessable_entity, [], @rental_item.errors.full_messages.join(', ')),
           status: :unprocessable_entity
  end

  # Use callbacks to share common setup or constraints between actions.
  def set_rental_item
    if RentalItem.exists?(params[:id])
      @rental_item = RentalItem.find(params[:id])
    else
      render json: fmt(not_found, [], "Not found rental_item = #{params[:id]}")
    end
  end

  # Only allow a list of trusted parameters through.
  def rental_item_params
    params.permit(:name, :name_en, :is_inside_shop_rentable, :is_outside_shop_rentable, :is_stage_rentable)
  end
end
