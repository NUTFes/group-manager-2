class CreateAssignGroupPlaces < ActiveRecord::Migration[6.0]
  def change
    create_table :assign_group_places do |t|
      t.integer :place_order_id
      t.integer :place_id

      t.timestamps
    end
  end
end
