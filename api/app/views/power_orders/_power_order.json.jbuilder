# frozen_string_literal: true

json.extract! power_order, :id, :group_id, :item, :power, :manufacturer, :model, :item_url, :created_at, :updated_at
json.url power_order_url(power_order, format: :json)
