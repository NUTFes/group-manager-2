json.extract! rental_order, :id, :group_id, :rental_item_id, :num, :created_at, :updated_at
json.url rental_order_url(rental_order, format: :json)
