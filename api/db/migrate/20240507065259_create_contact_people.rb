class CreateContactPeople < ActiveRecord::Migration[6.1]
  def change
    create_table :contact_people do |t|
      t.integer :group_id
      t.string :name
      t.string :email

      t.timestamps
    end
  end
end
