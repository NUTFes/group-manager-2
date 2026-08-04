
class AddSecretToGroups < ActiveRecord::Migration[6.1]
  class MigrationGroup < ActiveRecord::Base
    self.table_name = 'groups'
  end

  def up
    add_column :groups, :secret, :string

    MigrationGroup.reset_column_information
    MigrationGroup.find_each do |group|
      group.update_columns(secret: SecureRandom.base58(24))
    end

    change_column_null :groups, :secret, false
    add_index :groups, :secret, unique: true
  end

  def down
    remove_index :groups, :secret
    remove_column :groups, :secret
  end
end
