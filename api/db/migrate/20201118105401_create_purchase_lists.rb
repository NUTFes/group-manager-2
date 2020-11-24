class CreatePurchaseLists < ActiveRecord::Migration[6.0]
  def change
    create_table :purchase_lists do |t|
      t.integer :food_product_id
      t.integer :shop_id
      t.integer :fes_date_id
      t.string :items
      t.boolean :is_fresh

      t.timestamps
    end
  end
end
