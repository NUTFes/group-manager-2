# frozen_string_literal: true

class CreateItemRentalLogs < ActiveRecord::Migration[6.1]
  def change
    create_table :item_rental_logs do |t|
      t.string :uid, null: false
      t.bigint :stocker_place_id, null: false
      t.bigint :rental_item_id, null: false
      t.integer :category, null: false
      t.integer :quantity, null: false
      t.string :recorder_email, null: false

      t.timestamps
      t.index :uid, unique: true
      t.index :stocker_place_id
      t.index :rental_item_id
    end
  end
end
