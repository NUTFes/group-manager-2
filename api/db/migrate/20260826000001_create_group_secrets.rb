# frozen_string_literal: true

class CreateGroupSecrets < ActiveRecord::Migration[7.2]
  class MigrationGroup < ActiveRecord::Base
    self.table_name = 'groups'
  end

  class MigrationGroupSecret < ActiveRecord::Base
    self.table_name = 'group_secrets'
  end

  def up
    create_table :group_secrets do |t|
      t.references :group, null: false, foreign_key: true, index: { unique: true }
      t.string :secret, null: false, collation: 'utf8mb4_bin'

      t.timestamps
    end

    add_index :group_secrets, :secret, unique: true

    MigrationGroupSecret.reset_column_information
    MigrationGroup.find_each do |group|
      MigrationGroupSecret.create!(group_id: group.id, secret: SecureRandom.base58(24))
    end
  end

  def down
    drop_table :group_secrets
  end
end
