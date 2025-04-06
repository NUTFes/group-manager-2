# frozen_string_literal: true

class Place < ApplicationRecord
  has_many :assign_group_places
  has_many :place_allow_lists
  has_many :place_numbers

  def to_name
    name
  end

  # その会場の(開催年で絞り込んだ)参加団体(開催年で絞り込んだ)を取得する
  def groups(fes_year_id)
    place_numbers.preload(:group_identification).map do |place_number|
      place_number.group_identification.group if place_number.group_identification.group.fes_year_id == fes_year_id
    end.compact
  end

  # その会場で申請されている電力の総和を計算する
  def sum_power_orders(fes_year_id)
    sum_power_orders_by_place = 0
    sum_power_orders_by_place += place_numbers.preload(:group_identification).map do |place_number|
      if place_number.group_identification.group.fes_year_id == fes_year_id
        place_number.group_identification.group.sum_power_orders
      end
    end.compact.sum
    sum_power_orders_by_place
  end
end
