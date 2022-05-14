class StageOrder < ApplicationRecord
    belongs_to :group
    belongs_to :fes_date
    has_one :assign_stage, dependent: :destroy

    def self.with_groups
      @record = StageOrder.preload(:group)
        .map{
          |stage_order|
          {
            "stage_order": stage_order,
            "stage_order_info": stage_order.to_info_h,
            "group": stage_order.group
          }
        }
    end

    def self.with_group(stage_order_id)
      stage_order = StageOrder.find(stage_order_id)
      return {
        "stage_order": stage_order,
        "stage_order_info": stage_order.to_info_h,
        "group": stage_order.group
      }
    end

    def to_info_h
      @stages = Stage.all
      return {
        "stage_order": self.nil? ? nil : self,
        "is_sunny": self.is_sunny,
        "year": self.fes_date.fes_year.year_num,
        "date": self.fes_date.date,
        "day": self.fes_date.day,
        "day_num": self.fes_date.days_num,
        "stage_first": @stages[self.stage_first-1].name,
        "stage_second": @stages[self.stage_second-1].name,
        "use_time_interval": self.use_time_interval,
        "prepare_time_interval": self.prepare_time_interval,
        "cleanup_time_interval": self.cleanup_time_interval,
        "prepare_start_time": self.prepare_start_time,
        "performance_start_time": self.performance_start_time,
        "performance_end_time": self.performance_end_time,
        "cleanup_end_time": self.cleanup_end_time
      }
    end
end
