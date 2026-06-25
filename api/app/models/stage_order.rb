# frozen_string_literal: true

class StageOrder < ApplicationRecord
  belongs_to :group
  belongs_to :fes_date
  has_one :assign_stage, dependent: :destroy

  def self.with_groups
    @record = StageOrder.preload(:group)
                        .map do |stage_order|
      {
        stage_order: stage_order,
        stage_order_info: stage_order.to_info_h,
        group: stage_order.group
      }
    end
  end

  def self.with_group(stage_order_id)
    stage_order = StageOrder.find(stage_order_id)
    return {
      stage_order: stage_order,
      stage_order_info: stage_order.to_info_h,
      group: stage_order.group
    }
  end

  def to_info_h
    return {
      stage_order: self,
      is_sunny: is_sunny.nil?,
      year: fes_date.fes_year.year_num,
      date: fes_date.date,
      day: fes_date.day,
      day_num: fes_date.days_num,
      stage_first: stage_first.nil? ? nil : _stage_name(stage_first),
      stage_second: stage_second.nil? ? nil : _stage_name(stage_second),
      use_time_interval: use_time_interval,
      prepare_time_interval: prepare_time_interval,
      cleanup_time_interval: cleanup_time_interval,
      prepare_start_time: prepare_start_time,
      performance_start_time: performance_start_time,
      performance_end_time: performance_end_time,
      cleanup_end_time: cleanup_end_time
    }
  end

  def _stage_name(stage_id)
    if Stage.where(id: stage_id).empty?
      return nil
    else
      return Stage.find(stage_id).name
    end
  end
end
