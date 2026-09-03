# frozen_string_literal: true

require 'test_helper'

class RentalItemTest < ActiveSupport::TestCase
  # RentalItemの直接のitem_rental_logsだけでなく、
  # dependent: :destroyで連鎖するassign_rental_itemsがitem_rental_logsを持つ場合も削除できないこと
  test 'destroy is blocked while a dependent assign_rental_item has item_rental_logs' do
    rental_item = rental_items(:one)
    assign_rental_item = assign_rental_items(:one)

    assert_not rental_item.destroy
    assert RentalItem.exists?(rental_item.id)
    assert AssignRentalItem.exists?(assign_rental_item.id)
  end
end
