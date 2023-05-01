class AddAnnouncementToPublicRelations < ActiveRecord::Migration[6.1]
  def change
    add_column :public_relations, :announcement, :string
  end
end
