# frozen_string_literal: true

json.array! @power_orders, partial: 'power_orders/power_order', as: :power_order
