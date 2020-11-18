json.extract! purchase_list, :id, :food_product_id, :shop_id, :fes_date_id, :items, :is_fresh, :created_at, :updated_at
json.url purchase_list_url(purchase_list, format: :json)
