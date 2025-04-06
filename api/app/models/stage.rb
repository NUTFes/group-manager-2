class Stage < ApplicationRecord
  has_many :assign_stages
  has_many :stage_numbers

  # そのステージの参加団体を取得する
  def groups
    stage_numbers.preload(:group_identification).map do |stage_number|
      stage_number.group_identification.group
    end
  end
end
