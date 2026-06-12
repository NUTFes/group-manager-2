class CreatePlaceCategories < ActiveRecord::Migration[6.1]
  def change
    create_table :place_categories do |t|
      t.string :name, null: false
      t.references :parent, foreign_key: { to_table: :place_categories }, null: true

      t.timestamps
    end
  end
end
