class CreateVenueMaps < ActiveRecord::Migration[6.1]
  def change
    create_table :venue_maps do |t|
      t.integer :group_id
      t.string :picture_name
      t.string :picture_path

      t.timestamps
    end
  end
end
