class AddIsInternationalToGroups < ActiveRecord::Migration[6.1]
  def change
    add_column :groups, :is_international, :boolean
  end
end
