# frozen_string_literal: true

class AddRemarkToAssignRentalItems < ActiveRecord::Migration[6.1]
  def change
    add_column :assign_rental_items, :remark, :text
  end
end
