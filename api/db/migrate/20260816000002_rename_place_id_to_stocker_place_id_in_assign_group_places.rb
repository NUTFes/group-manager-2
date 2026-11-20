# frozen_string_literal: true

class RenamePlaceIdToStockerPlaceIdInAssignGroupPlaces < ActiveRecord::Migration[6.1]
  def up
    rename_column :assign_group_places, :place_id, :stocker_place_id
    change_column :assign_group_places, :stocker_place_id, :bigint, null: false
    add_index :assign_group_places, :stocker_place_id
    add_foreign_key :assign_group_places, :stocker_places, column: :stocker_place_id
  end

  def down
    remove_foreign_key :assign_group_places, :stocker_places, column: :stocker_place_id
    remove_index :assign_group_places, :stocker_place_id
    change_column :assign_group_places, :stocker_place_id, :integer, null: true
    rename_column :assign_group_places, :stocker_place_id, :place_id
  end
end
