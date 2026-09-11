class CreateUnRegisteredGroups < ActiveRecord::Migration[6.1]
  def change
    create_table :un_registered_groups do |t|
      t.references :group, null: false, foreign_key: true
      t.integer :order_type, null: false, default: 0

      t.timestamps
    end
  end
end
