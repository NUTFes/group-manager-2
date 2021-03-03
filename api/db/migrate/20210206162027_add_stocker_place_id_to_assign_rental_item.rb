class AddStockerPlaceIdToAssignRentalItem < ActiveRecord::Migration[6.0]
  def change
    add_column :assign_rental_items, :stocker_place_id, :integer
  end
end
