class AddIsAnnouncementRequestedToPublicRelations < ActiveRecord::Migration[6.1]
  def change
    add_column :public_relations, :is_announcement_requested, :boolean, null: false, default: false
  end
end
