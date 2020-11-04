class RemoveEmployeeCategoryIdFromEmployees < ActiveRecord::Migration[6.0]
  def change
    remove_column :employees, :employee_category_id, :integer
  end
end
