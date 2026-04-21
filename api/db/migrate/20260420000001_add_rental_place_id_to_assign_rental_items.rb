class AddRentalPlaceIdToAssignRentalItems < ActiveRecord::Migration[6.1]
  def change
    add_column :assign_rental_items, :rental_place_id, :integer
  end
end
