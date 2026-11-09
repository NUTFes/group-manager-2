# frozen_string_literal: true

json.array! @food_products, partial: 'food_products/food_product', as: :food_product
