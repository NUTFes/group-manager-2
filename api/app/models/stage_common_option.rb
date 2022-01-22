class StageCommonOption < ApplicationRecord
  belongs_to :group

  def to_info_h
    return {
      "own_equipment": self.own_equipment,
      "bgm": self.bgm,
      "camera_permission": self.camera_permission,
      "loud_sound": self.loud_sound,
      "stage_content": self.stage_content
    }
  end
end
