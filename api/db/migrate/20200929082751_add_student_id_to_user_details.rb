class AddStudentIdToUserDetails < ActiveRecord::Migration[6.0]
  def change
    add_column :user_details, :student_id, :integer
  end
end
