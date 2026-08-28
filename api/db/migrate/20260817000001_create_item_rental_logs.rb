# frozen_string_literal: true

class CreateItemRentalLogs < ActiveRecord::Migration[6.1]
  def change
    create_table :item_rental_logs do |t|
      t.string :uid, null: false
      t.references :stocker_place, null: false, foreign_key: true
      t.references :rental_item, null: false, foreign_key: true
      t.references :assign_rental_item, null: false, foreign_key: true
      t.integer :category, null: false
      t.integer :quantity, null: false
      t.string :recorder_email, null: false

      t.timestamps
      t.index :uid, unique: true
    end
  end
end
