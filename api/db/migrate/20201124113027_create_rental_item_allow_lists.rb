class CreateRentalItemAllowLists < ActiveRecord::Migration[6.0]
  def change
    create_table :rental_item_allow_lists do |t|
      t.integer :rental_item_id
      t.integer :group_category_id

      t.timestamps
    end
  end
end
