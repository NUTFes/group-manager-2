class CreatePowerOrders < ActiveRecord::Migration[6.0]
  def change
    create_table :power_orders do |t|
      t.integer :group_id
      t.string :item
      t.integer :power
      t.string :manufacture
      t.string :model

      t.timestamps
    end
  end
end
