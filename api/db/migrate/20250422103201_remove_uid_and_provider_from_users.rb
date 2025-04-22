class RemoveUidAndProviderFromUsers < ActiveRecord::Migration[6.1]
  def up
    remove_column :users, :uid, :string
    remove_column :users, :provider, :string
  end
  def down
    add_column :users, :uid, :string
    add_column :users, :provider, :string
    add_index :users, [:uid, :provider], unique: true
  end
end
