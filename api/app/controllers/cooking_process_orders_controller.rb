class CookingProcessOrdersController < ApplicationController
    def index
        cooking_process_orders = CookingProcessOrder.order(created_at: :desc)
        render json: cooking_process_orders
      end
end
