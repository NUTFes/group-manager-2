class AddIsAlcoholToFoodProducts < ActiveRecord::Migration[6.1]
  def change
    add_column :food_products, :is_alcohol, :boolean
  end
end
