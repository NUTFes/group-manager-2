class CreateUserPageSettings < ActiveRecord::Migration[6.0]
  def change
    create_table :user_page_settings do |t|
      t.boolean :is_regist_group
      t.boolean :is_regist_food_product
      t.boolean :is_edit_group
      t.boolean :is_edit_sub_rep
      t.boolean :is_edit_place
      t.boolean :is_edit_power_order
      t.boolean :is_edit_rental_order
      t.boolean :is_edit_stage_order
      t.boolean :is_edit_employee
      t.boolean :is_edit_food_product
      t.boolean :is_edit_purchase_list

      t.timestamps
    end
  end
end
