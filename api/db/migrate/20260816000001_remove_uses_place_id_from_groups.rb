# frozen_string_literal: true

class RemoveUsesPlaceIdFromGroups < ActiveRecord::Migration[6.1]
  def change
    remove_foreign_key :groups, :stocker_places, column: :uses_place_id
    remove_index :groups, :uses_place_id
    remove_column :groups, :uses_place_id, :bigint
  end
end
