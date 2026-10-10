# frozen_string_literal: true

json.extract! assign_group_place, :id, :place_order_id, :stocker_place_id, :created_at, :updated_at
json.url assign_group_place_url(assign_group_place, format: :json)
