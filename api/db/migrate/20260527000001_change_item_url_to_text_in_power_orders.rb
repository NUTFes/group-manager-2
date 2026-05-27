class ChangeItemUrlToTextInPowerOrders < ActiveRecord::Migration[6.0]
  def up
    change_column :power_orders, :item_url, :text
  end

  def down
    change_column :power_orders, :item_url, :string
  end
end
