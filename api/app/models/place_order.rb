# frozen_string_literal: true

class PlaceOrder < ApplicationRecord
  belongs_to :group
  has_one :assign_group_place, dependent: :destroy

  def self.get_with_groups
    @record = PlaceOrder.preload(:group)
      .map do |place_order|
      {
        place_order: place_order,
        place_order_name: place_order.to_place_name_h,
        group: place_order.group
      }
    end
  end

  def self.get_with_group(place_order_id)
    place_order = PlaceOrder.find(place_order_id)
    return {
      place_order: place_order,
      place_order_name: place_order.to_place_name_h,
      group: place_order.group
    }
  end

  # 会場申請を会場名のハッシュにして返す
  def to_place_name_h
    return {
      place_order: self,
      first: first.nil? ? nil : _place_name(first),
      second: second.nil? ? nil : _place_name(second),
      third: third.nil? ? nil : _place_name(third),
      remark: remark
    }
  end

  # 会場が存在するかを確認したのちnameを返す
  def _place_name(place_id)
    if Place.where(id: place_id).empty?
      return
    else
      return Place.find(place_id).name
    end
  end
end
