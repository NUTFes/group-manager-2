# frozen_string_literal: true

class UpdateItemRentalLogsForAdditionAndReduction < ActiveRecord::Migration[6.1]
  def up
    change_column_null :item_rental_logs, :assign_rental_item_id, true

    add_reference :item_rental_logs, :group, foreign_key: true

    execute <<~SQL.squish
      UPDATE item_rental_logs
      JOIN assign_rental_items ON assign_rental_items.id = item_rental_logs.assign_rental_item_id
      SET item_rental_logs.group_id = assign_rental_items.group_id
    SQL

    change_column_null :item_rental_logs, :group_id, false
  end

  def down
    if select_value('SELECT EXISTS(SELECT 1 FROM item_rental_logs WHERE assign_rental_item_id IS NULL)').to_i == 1
      raise ActiveRecord::IrreversibleMigration,
            'addition/reduction logs have no assign_rental_item_id to restore'
    end

    change_column_null :item_rental_logs, :assign_rental_item_id, false
    remove_reference :item_rental_logs, :group, foreign_key: true
  end
end
