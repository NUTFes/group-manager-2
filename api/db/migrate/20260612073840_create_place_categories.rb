class CreatePlaceCategories < ActiveRecord::Migration[6.1]
  def change
    create_table :place_categories do |t|
      t.string :name, null: false
      t.references :parent, foreign_key: { to_table: :place_categories }, null: true

      t.timestamps
    end

    add_check_constraint :place_categories, "parent_id IS NULL OR parent_id <> id", name: "check_parent_id_not_self"
  end
end
