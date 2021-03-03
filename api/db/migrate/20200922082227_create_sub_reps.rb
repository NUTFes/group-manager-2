class CreateSubReps < ActiveRecord::Migration[6.0]
  def change
    create_table :sub_reps do |t|
      t.integer :group_id
      t.string :name
      t.integer :department_id
      t.integer :grade_id
      t.string :tel
      t.string :email

      t.timestamps
    end
  end
end
