# frozen_string_literal: true

class RentalItem < ApplicationRecord
  has_many :rental_item_allow_lists, dependent: :destroy
  has_many :rental_orders, dependent: :destroy
  has_many :stocker_items, dependent: :destroy
  has_many :assign_rental_items, dependent: :destroy
  has_many :item_rental_logs, dependent: :restrict_with_error

  # 表示用の物品名。StockerPlace#display_name と同じ役割。
  # name / name_en はどちらもDB側でNOT NULL制約がなく未登録があり得るため、
  # 英語版で name_en が空のときは日本語名に、日本語名も空のときは空文字にフォールバックする
  def display_name(locale: :ja)
    return name_en if locale.to_s == 'en' && name_en.present?

    name.to_s
  end

  def to_info_h
    return {
      name: name,
      is_rentable: is_rentable
    }
  end
end
