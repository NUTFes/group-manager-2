class AddAddAnnouncementToUserPageSettings < ActiveRecord::Migration[6.1]
  def change
    add_column :user_page_settings, :add_announcement, :boolean
  end
end
