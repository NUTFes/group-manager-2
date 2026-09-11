# frozen_string_literal: true

json.array! @place_orders, partial: 'place_orders/place_order', as: :place_order
