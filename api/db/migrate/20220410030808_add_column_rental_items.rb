class AddColumnRentalItems < ActiveRecord::Migration[6.1]
  def change
    add_column :rental_items, :is_stage_rentable, :boolean
    rename_column :rental_items, :is_rentable, :is_shop_rentable
  end
end
