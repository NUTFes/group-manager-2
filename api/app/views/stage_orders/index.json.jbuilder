# frozen_string_literal: true

json.array! @stage_orders, partial: 'stage_orders/stage_order', as: :stage_order
