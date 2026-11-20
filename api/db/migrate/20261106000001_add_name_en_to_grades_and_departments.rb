class AddNameEnToGradesAndDepartments < ActiveRecord::Migration[6.1]
  def change
    add_column :grades, :name_en, :string
    add_column :departments, :name_en, :string
  end
end
