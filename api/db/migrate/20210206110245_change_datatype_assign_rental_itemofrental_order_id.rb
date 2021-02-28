class ChangeDatatypeAssignRentalItemofrentalOrderId < ActiveRecord::Migration[6.0]
  def change
    rename_column :assign_rental_items, :rental_order_id, :group_id
  end
end
