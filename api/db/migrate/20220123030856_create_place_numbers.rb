class CreatePlaceNumbers < ActiveRecord::Migration[6.1]
  def change
    create_table :place_numbers do |t|
      t.integer :place_id
      t.integer :group_identification_id

      t.timestamps
    end
  end
end
