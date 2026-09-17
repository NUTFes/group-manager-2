class AddUsesPlaceIdToGroups < ActiveRecord::Migration[6.1]
  def change
    add_column :groups, :uses_place_id, :bigint, null: true
    add_index :groups, :uses_place_id
    add_foreign_key :groups, :stocker_places, column: :uses_place_id
  end
end
