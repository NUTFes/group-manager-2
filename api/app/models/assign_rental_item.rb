# frozen_string_literal: true

class AssignRentalItem < ApplicationRecord
  belongs_to :group
  belongs_to :rental_item
  belongs_to :stocker_place, class_name: 'StockerPlace', optional: true
  belongs_to :rental_place, class_name: 'StockerPlace', optional: true
  has_many :item_rental_logs, dependent: :restrict_with_error

  validates :rental_place, presence: true, if: -> { rental_place_id.present? }

  # --- 当日の記録の集計（設計書5章）---
  #
  # rental/src/lib/aggregate.ts と同じ式をサーバー側にも持つ。画面とBFFだけで上限を
  # 見ていると、BFF用のトークンさえあればAPIを直接叩いて上限を無視した記録ができて
  # しまうため、記録の保存時にもここで確かめる（ItemRentalLog#quantity_within_limit）。

  # 団体間の割当変更（addition / reduction）。assign_rental_item に紐づかないので
  # 団体・物品・在庫場所の3つで突き合わせる。
  def assignment_change_logs
    ItemRentalLog.where(
      group_id: group_id,
      rental_item_id: rental_item_id,
      stocker_place_id: stocker_place_id,
      assign_rental_item_id: nil,
      category: ItemRentalLog::ASSIGNMENT_CHANGE_CATEGORIES
    )
  end

  # 実効割当数 = num + Σaddition − Σreduction
  def effective_num
    assignment_change_logs.reduce(num) do |sum, log|
      log.addition? ? sum + log.quantity : sum - log.quantity
    end
  end

  # 貸出済 = 直近 rental_absolute + それ以降の Σrental（絶対値ログが無ければ Σrental）
  def lent_quantity
    accumulated_quantity('rental', 'rental_absolute')
  end

  def returned_quantity
    accumulated_quantity('return', 'return_absolute')
  end

  # 貸出残 = 実効割当数 − 貸出済
  def lent_remaining
    [effective_num - lent_quantity, 0].max
  end

  # 返却残 = 貸出済 − 返却済
  def return_remaining
    [lent_quantity - returned_quantity, 0].max
  end

  # 在庫場所名（物品が保管されている場所）。未設定の場合は空文字
  def stock_place_name(locale: :ja)
    stocker_place&.display_name(locale: locale).to_s
  end

  # 貸出場所名（当日の受け渡し場所）。貸出場所調整で未設定の場合は空文字
  def rental_place_name(locale: :ja)
    rental_place&.display_name(locale: locale).to_s
  end

  def self.with_groups_and_rental_item
    @record = AssignRentalItem.preload(:group)
                              .map do |assign_rental_item|
      {
        assign_rental_item: assign_rental_item,
        rental_item: assign_rental_item.rental_item,
        group: assign_rental_item.group
      }
    end
  end

  def self.with_rental_item(assign_rental_item_id)
    assign_rental_item = AssignRentalItem.find(assign_rental_item_id)
    return {
      assign_rental_item: assign_rental_item,
      rental_item: assign_rental_item.rental_item,
      group: assign_rental_item.group
    }
  end

  # 直近の絶対値ログで累計を上書きし、それより後の通常記録を足す
  def accumulated_quantity(normal_category, absolute_category)
    logs = item_rental_logs.order(:created_at, :id).to_a
    last_absolute_index = logs.rindex { |log| log.category == absolute_category }
    target_logs = last_absolute_index.nil? ? logs : logs[(last_absolute_index + 1)..]
    base = last_absolute_index.nil? ? 0 : logs[last_absolute_index].quantity

    target_logs.sum { |log| log.category == normal_category ? log.quantity : 0 } + base
  end

  def to_rental_item_info_h
    return {
      rental_item: nil? ? nil : self,
      name: rental_item.name,
      is_inside_shop_rentable: rental_item.is_inside_shop_rentable,
      is_outside_shop_rentable: rental_item.is_outside_shop_rentable,
      is_stage_rentable: rental_item.is_stage_rentable,
      num: num
    }
  end
end
