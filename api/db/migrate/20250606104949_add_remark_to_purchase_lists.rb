class AddRemarkToPurchaseLists < ActiveRecord::Migration[6.1]
  def change
    add_column :purchase_lists, :remark, :string
  end
end
