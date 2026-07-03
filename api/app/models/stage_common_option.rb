# frozen_string_literal: true

class StageCommonOption < ApplicationRecord
  belongs_to :group

  def self.with_groups
    @record = StageCommonOption.preload(:group)
      .map do |stage_common_option|
      {
        stage_common_option: stage_common_option,
        group: stage_common_option.group
      }
    end
  end

  def self.with_group(stage_common_option_id)
    stage_common_option = StageCommonOption.find(stage_common_option_id)
    return {
      stage_common_option: stage_common_option,
      group: stage_common_option.group
    }
  end

  def to_info_h
    return {
      id: id,
      own_equipment: own_equipment,
      bgm: bgm,
      camera_permission: camera_permission,
      loud_sound: loud_sound
    }
  end
end
