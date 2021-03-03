class CreateRentableItems < ActiveRecord::Migration[6.0]
  def change
    create_table :rentable_items do |t|
      t.integer :stocker_item_id
      t.integer :stocker_place_id
      t.integer :max_num

      t.timestamps
    end
  end
end
