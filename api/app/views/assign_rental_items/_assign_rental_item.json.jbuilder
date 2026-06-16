# frozen_string_literal: true

json.extract! assign_rental_item, :id, :group_id, :rental_item_id, :num, :stocker_place_id, :created_at, :updated_at
json.url assign_rental_item_url(assign_rental_item, format: :json)
