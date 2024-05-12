class StageCommonOption < ApplicationRecord
  belongs_to :group

  def self.with_groups
    @record = StageCommonOption.preload(:group)
      .map{
        |stage_common_option|
        {
          "stage_common_option": stage_common_option,
          "group": stage_common_option.group
        }
      }
  end

  def self.with_group(stage_common_option_id)
    stage_common_option = StageCommonOption.find(stage_common_option_id)
    return {
      "stage_common_option": stage_common_option,
      "group": stage_common_option.group
    }
  end

  def to_info_h
    return {
      "id": self.id,
      "own_equipment": self.own_equipment,
      "bgm": self.bgm,
      "camera_permission": self.camera_permission,
      "loud_sound": self.loud_sound
    }
  end
end
