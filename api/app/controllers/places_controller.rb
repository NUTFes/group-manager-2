# frozen_string_literal: true

class PlacesController < ApplicationController
  before_action :set_place, only: %i[show update destroy]

  def index
    group_id = params[:group_id]
    # group_idがnilまたは空でない場合、group_idで選択肢を表示
    if group_id.present?
      @group = Group.find_by(id: group_id)
      if @group
        @places = if @group.is_food_sales
                    # MEMO: 食品販売グループの場合、外のエリアの場所を表示
                    # 1: 希望なし
                    # 5: 事務棟エリア（講義室は含まない。)
                    # 6: 図書館エリア
                    # 7: 電気棟エリア
                    # 8: メインステージエリア（情報処理センター前）
                    # 9: 機械・建設棟エリア
                    # 10: その他のエリア
                    Place.where(id: [1, 5, 6, 7, 8, 9, 10])
                  else
                    Place.all
                  end
        render json: fmt(ok, @places)
      else
        render json: fmt(not_found, [], "Not found group = #{group_id}")
      end
      return
    end
    @places = Place.all
    render json: fmt(ok, @places)
  end

  def show
    render json: fmt(ok, @place)
  end

  def create
    @place = Place.create(place_params)
    render json: fmt(created, @place)
  end

  def update
    @place.update(place_params)
    render json: fmt(created, @place, "Updated place id = #{params[:id]}")
  end

  # DELETE /place_orders/1
  # DELETE /place_orders/1.json
  def destroy
    @place.destroy
    render json: fmt(ok, [], "Deleted place = #{params[:id]}")
  end

  private

  # Use callbacks to share common setup or constraints between actions.
  def set_place
    if Place.exists?(params[:id])
      @place = Place.find(params[:id])
    else
      render json: fmt(not_found, [], "Not found place = #{params[:id]}")
    end
  end

  # Only allow a list of trusted parameters through.
  def place_params
    params.permit(:name)
  end
end
