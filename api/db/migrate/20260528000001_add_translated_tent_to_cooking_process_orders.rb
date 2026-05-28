# frozen_string_literal: true

class AddTranslatedTentToCookingProcessOrders < ActiveRecord::Migration[6.1]
  def change
    add_column :cooking_process_orders, :tent_ja, :text
    add_column :cooking_process_orders, :tent_source_hash, :string
  end
end
