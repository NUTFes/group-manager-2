class CreateStoolTests < ActiveRecord::Migration[6.1]
  def change
    create_table :stool_tests do |t|
      t.string :status

      t.timestamps
    end
  end
end
