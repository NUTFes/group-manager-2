class AddColumnEmployee < ActiveRecord::Migration[6.1]
  def change
    add_column :employees, :stool_test_id, :integer
  end
end
