class CreateGroups < ActiveRecord::Migration[6.0]
  def change
    create_table :groups do |t|
      t.string :name
      t.integer :group_category_id
      t.integer :user_id
      t.text :activity
      t.integer :fes_year_id

      t.timestamps
    end
  end
end
