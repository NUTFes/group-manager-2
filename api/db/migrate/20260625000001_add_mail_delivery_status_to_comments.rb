class AddMailDeliveryStatusToComments < ActiveRecord::Migration[6.1]
  def change
    add_column :comments, :mail_delivery_status, :integer, null: false, default: 0
  end
end
