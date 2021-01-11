class CreateAssignRentalItems < ActiveRecord::Migration[6.0]
  def change
    create_table :assign_rental_items do |t|
      t.integer :rental_order_id
      t.integer :rentable_item_id
      t.integer :num

      t.timestamps
    end
  end
end
