class AddIsEditFireEquipmentOrderToUserPageSettings < ActiveRecord::Migration[6.1]
  def change
    add_column :user_page_settings, :is_edit_fire_equipment_order, :boolean, default: true
  end
end
