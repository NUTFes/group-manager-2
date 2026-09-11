class AddFoodProductToCookingProcessOrders < ActiveRecord::Migration[6.1]
  def change
    add_reference :cooking_process_orders, :food_product, null: false, foreign_key: true
  end
end
