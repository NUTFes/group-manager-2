class CreateEmployees < ActiveRecord::Migration[6.0]
  def change
    create_table :employees do |t|
      t.integer :group_id
      t.string :name
      t.integer :student_id
      t.integer :employee_category_id

      t.timestamps
    end
  end
end
