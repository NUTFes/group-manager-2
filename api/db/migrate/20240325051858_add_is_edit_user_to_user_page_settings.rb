class AddIsEditUserToUserPageSettings < ActiveRecord::Migration[6.1]
  def change
    add_column :user_page_settings, :is_edit_user, :boolean
    add_column :user_page_settings, :is_edit_stage_common_option, :boolean
    add_column :user_page_settings, :is_edit_public_relation, :boolean
    add_column :user_page_settings, :is_edit_venue_map, :boolean
    add_column :user_page_settings, :is_edit_cooking_process, :boolean
    add_column :user_page_settings, :add_stage_order, :boolean
  end
end
