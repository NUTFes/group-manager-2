class CreateStockerItems < ActiveRecord::Migration[6.0]
  def change
    create_table :stocker_items do |t|
      t.integer :rental_item_id
      t.integer :stocker_place_id
      t.integer :fes_year_id
      t.integer :num

      t.timestamps
    end
  end
end
