class CreateFoodProducts < ActiveRecord::Migration[6.0]
  def change
    create_table :food_products do |t|
      t.integer :group_id
      t.string :name
      t.boolean :is_cooking
      t.integer :first_day_num
      t.integer :second_day_num

      t.timestamps
    end
  end
end
