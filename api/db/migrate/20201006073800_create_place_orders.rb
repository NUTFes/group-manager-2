class CreatePlaceOrders < ActiveRecord::Migration[6.0]
  def change
    create_table :place_orders do |t|
      t.integer :group_id
      t.integer :first
      t.integer :second
      t.integer :third
      t.text :remark

      t.timestamps
    end
  end
end
