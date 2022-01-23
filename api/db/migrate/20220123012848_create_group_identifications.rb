class CreateGroupIdentifications < ActiveRecord::Migration[6.1]
  def change
    create_table :group_identifications do |t|
      t.integer :group_id
      t.integer :number

      t.timestamps
    end
  end
end
