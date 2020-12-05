class CreateRentalOrders < ActiveRecord::Migration[6.0]
  def change
    create_table :rental_orders do |t|
      t.integer :group_id
      t.integer :rental_item_id
      t.integer :num

      t.timestamps
    end
  end
end
