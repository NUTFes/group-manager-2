class CreateUserDetails < ActiveRecord::Migration[6.0]
  def change
    create_table :user_details do |t|
      t.integer :tel
      t.integer :grade_id
      t.integer :department_id
      t.references :user, null: false, foreign_key: true

      t.timestamps
    end
  end
end
