class CreateCurrentStocks < ActiveRecord::Migration[6.1]
  def change
    create_table :current_stocks do |t|
      t.integer :place_category_id
      t.integer :place_id
      t.integer :item_id
      t.integer :stock_num
      t.integer :date_id
      t.timestamps
    end
  end
end
