class AddIsEditAnnouncementToUserPageSettings < ActiveRecord::Migration[6.1]
  def change
    add_column :user_page_settings, :is_edit_announcement, :boolean
  end
end
