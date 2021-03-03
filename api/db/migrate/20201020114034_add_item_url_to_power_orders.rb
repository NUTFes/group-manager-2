class AddItemUrlToPowerOrders < ActiveRecord::Migration[6.0]
  def change
    add_column :power_orders, :item_url, :string
  end
end
