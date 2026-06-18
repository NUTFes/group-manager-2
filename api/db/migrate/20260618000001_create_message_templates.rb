# frozen_string_literal: true

class CreateMessageTemplates < ActiveRecord::Migration[6.1]
  def change
    create_table :message_templates do |t|
      t.integer :locale, null: false
      t.string :name, null: false
      t.string :subject, null: false
      t.text :body, null: false

      t.timestamps
      t.index %i[name locale], unique: true
    end
  end
end
