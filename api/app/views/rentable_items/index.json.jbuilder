# frozen_string_literal: true

json.array! @rentable_items, partial: 'rentable_items/rentable_item', as: :rentable_item
