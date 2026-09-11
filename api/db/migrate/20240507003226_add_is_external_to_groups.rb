class AddIsExternalToGroups < ActiveRecord::Migration[6.1]
  def change
    add_column :groups, :is_external, :boolean
  end
end
