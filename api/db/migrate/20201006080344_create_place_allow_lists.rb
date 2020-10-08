class CreatePlaceAllowLists < ActiveRecord::Migration[6.0]
  def change
    create_table :place_allow_lists do |t|
      t.integer :place_id
      t.integer :group_category_id
      t.boolean :enable

      t.timestamps
    end
  end
end
