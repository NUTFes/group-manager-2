class RemovePublicRelationFromAnnouncement < ActiveRecord::Migration[6.1]
  def change
    remove_column :public_relations, :announcement, :string
  end
end
