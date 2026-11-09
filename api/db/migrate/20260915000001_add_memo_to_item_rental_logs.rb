# frozen_string_literal: true

class AddMemoToItemRentalLogs < ActiveRecord::Migration[6.1]
  def change
    # 当日スタッフが記録に添えるメモ。実行委員が事前に入れる
    # assign_rental_items.remark とは別物で、こちらは記録1件ごとに残る。
    add_column :item_rental_logs, :memo, :text
  end
end
