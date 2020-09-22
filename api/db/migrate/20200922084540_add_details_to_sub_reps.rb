class AddDetailsToSubReps < ActiveRecord::Migration[6.0]
  def change
    add_column :sub_reps, :student_id, :integer
  end
end
