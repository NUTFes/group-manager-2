# frozen_string_literal: true

class StockerPlace < ApplicationRecord
  has_many :stocker_items, dependent: :destroy
  has_many :rentable_items, dependent: :destroy
  has_many :assign_rental_items, dependent: :destroy
  has_many :assign_group_places, dependent: :destroy
  belongs_to :place_category, optional: true

  validate :place_category_id_must_be_nil_or_integer
  # 書類出力用の場所名。
  # name / name_en はどちらもDB側でNOT NULL制約がなく未登録があり得るため、
  # 英語版で name_en が空のときは日本語名に、日本語名も空のときは空文字にフォールバックする
  def display_name(locale: :ja)
    return name_en if locale.to_s == 'en' && name_en.present?

    name.to_s
  end

  private

  def place_category_id_must_be_nil_or_integer
    return unless place_category_id_before_type_cast == ''

    errors.add(:place_category_id, 'must be nil or integer')
  end
end
