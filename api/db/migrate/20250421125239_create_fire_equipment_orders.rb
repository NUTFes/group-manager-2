class CreateFireEquipmentOrders < ActiveRecord::Migration[6.1]
  def change
    create_table :fire_equipment_orders do |t|
      t.string :name, null: false
      t.integer :quantity, null: false
      t.integer :fuel, default: 0 # enum {ガスボンベ、LPガス、炭}
      t.text :usage
      t.boolean :is_takeaway
      t.text :remark
      t.references :group, null: false, foreign_key: true

      t.timestamps
    end
  end
end
