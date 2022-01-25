class Stage < ApplicationRecord
    has_many :assign_stages
    has_many :stage_numbers

    # そのステージの参加団体を取得する
    def groups
      return self.stage_numbers.preload(:group_identification).map{ |stage_number| stage_number.group_identification.group }
    end
end
