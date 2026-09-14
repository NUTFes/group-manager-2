# frozen_string_literal: true

class DedupeAndAddUniqueIndexToAssignRentalItems < ActiveRecord::Migration[6.1]
  INDEX_NAME = 'index_assign_rental_items_on_group_place_item'

  # あえて重複統合ロジックは持たない。既存データに重複があれば、この
  # add_index 自体が一意制約違反で失敗してマイグレーションが止まる。
  # その場合は自動で1行に統合してデータ（remark や rental_place_id 等）を
  # 黙って破棄するのではなく、実データを見て手動で対応すること。
  def up
    add_index :assign_rental_items,
              %i[group_id stocker_place_id rental_item_id],
              unique: true,
              name: INDEX_NAME
  end

  def down
    remove_index :assign_rental_items, name: INDEX_NAME
  end
end
