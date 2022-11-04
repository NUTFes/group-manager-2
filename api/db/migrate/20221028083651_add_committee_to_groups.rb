class AddCommitteeToGroups < ActiveRecord::Migration[6.1]
  def change
    add_column :groups, :committee, :boolean
  end
end
