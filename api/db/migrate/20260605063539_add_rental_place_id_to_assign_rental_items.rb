class AddRentalPlaceIdToAssignRentalItems < ActiveRecord::Migration[6.1]
  def change
    add_column :assign_rental_items, :rental_place_id, :integer, null: true
    add_index :assign_rental_items, :rental_place_id
    add_foreign_key :assign_rental_items, :stocker_places, column: :rental_place_id
  end
end
