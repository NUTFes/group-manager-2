class CreateCookingProcessOrders < ActiveRecord::Migration[6.1]
  def change
    create_table :cooking_process_orders do |t|
      t.references :group, null: false, foreign_key: true
      t.text :pre_open_kitchen
      t.text :pre_open_tent
      t.text :during_open_kitchen
      t.text :tent
      t.timestamps
    end
  end
end
