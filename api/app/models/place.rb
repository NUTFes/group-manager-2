# frozen_string_literal: true

class Place < ApplicationRecord
  has_many :place_allow_lists, dependent: :destroy
  has_many :place_numbers, dependent: :destroy

  def to_name
    return name
  end

  # その会場の(開催年で絞り込んだ)参加団体(開催年で絞り込んだ)を取得する
  def groups(fes_year_id)
    return place_numbers.preload(:group_identification).filter_map { |place_number| place_number.group_identification.group if place_number.group_identification.group.fes_year_id == fes_year_id }
  end

  # その会場で申請されている電力の総和を計算する
  def sum_power_orders(fes_year_id)
    sum_power_orders_by_place = 0
    sum_power_orders_by_place += place_numbers.preload(:group_identification).filter_map { |place_number| place_number.group_identification.group.sum_power_orders if place_number.group_identification.group.fes_year_id == fes_year_id }.sum
    return sum_power_orders_by_place
  end
end
