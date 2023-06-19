class AddColumnPurchaseLists < ActiveRecord::Migration[6.1]
  def change
    add_column :purchase_lists, :purchase_date, :string
    add_column :purchase_lists, :url, :string
  end
end
