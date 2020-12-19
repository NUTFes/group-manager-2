json.extract! food_product, :id, :group_id, :name, :is_cooking, :first_day_num, :second_day_num, :created_at, :updated_at
json.url food_product_url(food_product, format: :json)
