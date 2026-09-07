# frozen_string_literal: true

class DedupeAndAddUniqueIndexToAssignRentalItems < ActiveRecord::Migration[6.1]
  class MigrationAssignRentalItem < ActiveRecord::Base
    self.table_name = 'assign_rental_items'
  end

  INDEX_NAME = 'index_assign_rental_items_on_group_place_item'

  def up
    merge_duplicate_rows

    add_index :assign_rental_items,
              %i[group_id stocker_place_id rental_item_id],
              unique: true,
              name: INDEX_NAME
  end

  # 同一 (group_id, stocker_place_id, rental_item_id) の重複行を1行へ統合する。
  # num は合算、remark は最小idの非空を優先する。
  def merge_duplicate_rows
    MigrationAssignRentalItem.reset_column_information

    dup_keys = MigrationAssignRentalItem
               .where.not(group_id: nil)
               .where.not(stocker_place_id: nil)
               .where.not(rental_item_id: nil)
               .group(:group_id, :stocker_place_id, :rental_item_id)
               .having('COUNT(*) > 1')
               .pluck(:group_id, :stocker_place_id, :rental_item_id)

    dup_keys.each do |group_id, stocker_place_id, rental_item_id|
      rows = MigrationAssignRentalItem
             .where(group_id: group_id, stocker_place_id: stocker_place_id, rental_item_id: rental_item_id)
             .order(:id)
             .to_a
      keeper = rows.first
      keeper.update!(
        num: rows.sum { |r| r.num.to_i },
        remark: rows.map(&:remark).find(&:present?)
      )
      MigrationAssignRentalItem.where(id: rows.drop(1).map(&:id)).delete_all
    end
  end

  def down
    remove_index :assign_rental_items, name: INDEX_NAME
  end
end
