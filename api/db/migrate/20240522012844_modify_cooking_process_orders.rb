class ModifyCookingProcessOrders < ActiveRecord::Migration[6.1]
  def change
    change_table :cooking_process_orders do |t|
      t.remove :pre_open_kitchen
      t.remove :pre_open_tent
      t.remove :during_open_kitchen
      t.remove :tent

      t.boolean :pre_open_kitchen, null: false, default: false
      t.boolean :during_open_kitchen, null: false, default: false
      t.text :tent
    end
  end
end