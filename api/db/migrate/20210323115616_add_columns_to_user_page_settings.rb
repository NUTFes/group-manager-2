class AddColumnsToUserPageSettings < ActiveRecord::Migration[6.0]
  def change
    add_column :user_page_settings, :add_power_order, :boolean
    add_column :user_page_settings, :add_rental_order, :boolean
    add_column :user_page_settings, :add_employee, :boolean
    add_column :user_page_settings, :add_food_product, :boolean
    add_column :user_page_settings, :add_purchase_list, :boolean
  end
end
