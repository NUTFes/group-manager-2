class CreateStages < ActiveRecord::Migration[6.0]
  def change
    create_table :stages do |t|
      t.string :name
      t.boolean :enable_sunny
      t.boolean :enable_rainy

      t.timestamps
    end
  end
end
