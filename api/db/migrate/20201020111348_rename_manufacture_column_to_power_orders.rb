class RenameManufactureColumnToPowerOrders < ActiveRecord::Migration[6.0]
  def change
    rename_column :power_orders, :manufacture, :manufacturer
  end
end
