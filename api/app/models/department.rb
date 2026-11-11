# frozen_string_literal: true

class Department < ApplicationRecord
  has_many :user_details, dependent: :destroy
  has_many :sub_reps, dependent: :destroy

  # 書類出力用の名称。
  # 英語版で name_en が空のときは日本語名にフォールバックする
  def display_name(locale: :ja)
    return name_en if locale.to_s == 'en' && name_en.present?

    name.to_s
  end
end
