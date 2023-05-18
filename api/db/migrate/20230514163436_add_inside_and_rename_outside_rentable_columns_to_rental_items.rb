class AddInsideAndRenameOutsideRentableColumnsToRentalItems < ActiveRecord::Migration[6.1]
  def change
    add_column :rental_items, :is_inside_shop_rentable, :boolean
    add_column :rental_items, :is_outside_shop_rentable, :boolean
  end
end
