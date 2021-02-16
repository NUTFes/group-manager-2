class AddDetailsToStockerPlaces < ActiveRecord::Migration[6.0]
  def change
    add_column :stocker_places, :stock_item_status, :integer
    add_column :stocker_places, :assign_item_status, :integer
  end
end
