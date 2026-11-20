class AddStatusToAnnouncements < ActiveRecord::Migration[6.1]
  def change
    add_column :announcements, :status, :string
  end
end
