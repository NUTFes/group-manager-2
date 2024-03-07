class CreateItemAdjustments < ActiveRecord::Migration[6.1]
  def change
    create_table :item_adjustments do |t|

      t.integer :group_id
      t.integer :use_place_id
      t.integer :rental_place_id
      t.integer :item_id
      t.integer :item_num
      t.integer :people_num
      t.datetime :time_start
      t.datetime :time_end
      t.integer :date_id
      
      t.timestamps
    end
  end
end
