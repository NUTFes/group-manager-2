# frozen_string_literal: true

class RenamePlaceIdToStockerPlaceIdInAssignGroupPlaces < ActiveRecord::Migration[6.1]
  def change
    rename_column :assign_group_places, :place_id, :stocker_place_id
    change_column :assign_group_places, :stocker_place_id, :bigint
    add_index :assign_group_places, :stocker_place_id
    add_foreign_key :assign_group_places, :stocker_places, column: :stocker_place_id
  end
end
