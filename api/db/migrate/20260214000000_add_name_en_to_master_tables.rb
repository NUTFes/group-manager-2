class AddNameEnToMasterTables < ActiveRecord::Migration[6.1]
  def change
    add_column :rental_items, :name_en, :string
    add_column :stocker_places, :name_en, :string
    add_column :group_categories, :name_en, :string
  end
end
