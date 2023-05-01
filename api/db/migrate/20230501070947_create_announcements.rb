class CreateAnnouncements < ActiveRecord::Migration[6.1]
  def change
    create_table :announcements do |t|
      t.integer :group_id
      t.text :message

      t.timestamps
    end
  end
end
