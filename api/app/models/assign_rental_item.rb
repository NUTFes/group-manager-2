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

  # 同じ(団体×物品×在庫場所)の割当の未貸出数の合計。超過貸出で回せる上限になる。
  #
  # 割当ごとに lent_remaining を呼ぶと1件につき2クエリ増えるため、割当変更ログと
  # 各割当の記録をここで1回ずつ引いて渡す（クエリ数は割当件数によらず3回）。
  # lock: true にすると割当行を FOR UPDATE で押さえる（同時実行で上限を超えないため）。
  def self.unlent_quantity_for(group_id:, rental_item_id:, stocker_place_id:, lock: false)
    scope = where(group_id: group_id, rental_item_id: rental_item_id, stocker_place_id: stocker_place_id)
    scope = scope.lock if lock
    assignments = scope.to_a
    return 0 if assignments.empty?

    change_logs = ItemRentalLog.where(
      group_id: group_id, rental_item_id: rental_item_id, stocker_place_id: stocker_place_id,
      assign_rental_item_id: nil, category: ItemRentalLog::ASSIGNMENT_CHANGE_CATEGORIES
    ).to_a
    logs_by_assignment = ItemRentalLog.where(assign_rental_item_id: assignments.map(&:id))
                                      .order(:created_at, :id)
                                      .group_by(&:assign_rental_item_id)

    assignments.sum do |assignment|
      assignment.lent_remaining(change_logs: change_logs, logs: logs_by_assignment[assignment.id] || [])
    end
  end

  # 同じ(団体×物品×在庫場所)の実効割当数の合計。割当が複数あっても実態と食い違わないよう、
  # unlent_quantity_for と同じく合算する（割当変更ログは共通なので1回だけ引く）。
  def self.effective_num_for(group_id:, rental_item_id:, stocker_place_id:)
    assignments = where(group_id: group_id, rental_item_id: rental_item_id,
                        stocker_place_id: stocker_place_id).to_a
    return 0 if assignments.empty?

    change_logs = ItemRentalLog.where(
      group_id: group_id, rental_item_id: rental_item_id, stocker_place_id: stocker_place_id,
      assign_rental_item_id: nil, category: ItemRentalLog::ASSIGNMENT_CHANGE_CATEGORIES
    ).to_a

    assignments.sum { |assignment| assignment.effective_num(change_logs: change_logs) }
  end

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

  # 以下の集計は change_logs / logs に読み込み済みの配列を渡せる。まとめて集計するときに
  # 割当1件ごとのクエリを避けるための口で、省略すれば自分で引く。

  # 実効割当数 = num + Σaddition − Σreduction
  def effective_num(change_logs: nil)
    logs = change_logs || assignment_change_logs.to_a
    logs.reduce(num) do |sum, log|
      next sum unless matches_assignment?(log)

      log.category == 'addition' ? sum + log.quantity : sum - log.quantity
    end
  end

  # 貸出済 = 直近 rental_absolute + それ以降の Σrental（絶対値ログが無ければ Σrental）
  def lent_quantity(logs: nil)
    accumulated_quantity('rental', 'rental_absolute', logs)
  end

  def returned_quantity(logs: nil)
    accumulated_quantity('return', 'return_absolute', logs)
  end

  # 貸出残 = 実効割当数 − 貸出中（貸出済 − 返却済）。
  # 返ってきた物はまた貸し出せるので、返却済のぶんは残数に戻す。
  def lent_remaining(change_logs: nil, logs: nil)
    [effective_num(change_logs: change_logs) - lent_quantity(logs: logs) + returned_quantity(logs: logs), 0].max
  end

  # 返却残 = 貸出済 − 返却済
  def return_remaining(logs: nil)
    [lent_quantity(logs: logs) - returned_quantity(logs: logs), 0].max
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

  # 割当変更ログがこの割当（団体×物品×在庫場所）のものか
  def matches_assignment?(log)
    log.group_id == group_id &&
      log.rental_item_id == rental_item_id &&
      log.stocker_place_id == stocker_place_id
  end

  # 直近の絶対値ログで累計を上書きし、それより後の通常記録を足す
  def accumulated_quantity(normal_category, absolute_category, preloaded_logs = nil)
    logs = preloaded_logs || item_rental_logs.order(:created_at, :id).to_a
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
