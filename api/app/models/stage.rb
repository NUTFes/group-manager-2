# frozen_string_literal: true

class Stage < ApplicationRecord
  has_many :assign_stages, dependent: :destroy
  has_many :stage_numbers, dependent: :destroy

  # そのステージの参加団体を取得する
  def groups
    return stage_numbers.preload(:group_identification).map { |stage_number| stage_number.group_identification.group }
  end
end
