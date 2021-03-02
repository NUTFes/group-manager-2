json.extract! user_page_setting, :id, :is_regist_group, :is_regist_food_product, :is_edit_group, :is_edit_sub_rep, :is_edit_place, :is_edit_power_order, :is_edit_rental_order, :is_edit_stage_order, :is_edit_employee, :is_edit_food_product, :is_edit_purchase_list, :created_at, :updated_at
json.url user_page_setting_url(user_page_setting, format: :json)
