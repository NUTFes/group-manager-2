class AddIsCommitteeToPowerOrders < ActiveRecord::Migration[6.1]
  def change
    add_column :power_orders, :is_committee, :boolean
  end
end
