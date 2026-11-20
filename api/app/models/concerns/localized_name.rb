# frozen_string_literal: true

# name（日本語）と name_en（英語）を持つモデル向けの、言語ごとの名称の出し分け
module LocalizedName
  extend ActiveSupport::Concern

  # 英語版で name_en が空のときは日本語名に、日本語名も空のときは空文字にフォールバックする
  def display_name(locale: :ja)
    return name_en if locale.to_s == 'en' && name_en.present?

    name.to_s
  end
end
