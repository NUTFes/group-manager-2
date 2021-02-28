class RenameRentableItemIdColumnToAssignRentalItems < ActiveRecord::Migration[6.0]
  def change
    rename_column :assign_rental_items, :rentable_item_id, :rental_item_id
  end
end
