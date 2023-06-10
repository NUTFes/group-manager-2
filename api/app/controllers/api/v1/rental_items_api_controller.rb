class Api::V1::RentalItemsApiController < ApplicationController

  def get_rentable_items
    @items = RentalItem.where(is_inside_shop_rentable: true).where(is_outside_shop_rentable: true).where(is_stage_rentable: true)
    render json: fmt(ok, @items)
  end

  # 模擬店での貸出物品
  def get_all_rentable_items
    @items = RentalItem.where(is_inside_shop_rentable: true).or(RentalItem.where(is_outside_shop_rentable: true)).or(RentalItem.where(is_stage_rentable: true))
    render json: fmt(ok, @items)
  end

  # 模擬店での貸出物品
  def get_shop_rentable_items
    @items = RentalItem.where(is_inside_shop_rentable: true).where(is_outside_shop_rentable: true)
    render json: fmt(ok, @items)
  end

  # 屋内模擬店での貸出物品
  def get_inside_shop_rentable_items
    @items = RentalItem.where(is_inside_shop_rentable: true)
    render json: fmt(ok, @items)
  end

  # 屋外模擬店での貸出物品
  def get_outside_shop_rentable_items
    @items = RentalItem.where(is_outside_shop_rentable: true)
    render json: fmt(ok, @items)
  end

  # ステージでの貸出物品
  def get_stage_rentable_items
    @items = RentalItem.where(is_stage_rentable: true)
    render json: fmt(ok, @items)
  end

end
