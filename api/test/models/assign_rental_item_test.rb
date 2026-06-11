# frozen_string_literal: true

require 'test_helper'

class AssignRentalItemTest < ActiveSupport::TestCase
  fixtures :groups, :rental_items, :stocker_places

  def setup
    @group = groups(:one)
    @rental_item = rental_items(:one)
    @stocker_place = stocker_places(:one)
  end

  test 'should be valid with a valid rental_place' do
    assign_rental_item = AssignRentalItem.new(
      group: @group,
      rental_item: @rental_item,
      num: 1,
      rental_place: @stocker_place
    )
    assert assign_rental_item.valid?
    assert_equal @stocker_place, assign_rental_item.rental_place
  end

  test 'should be valid without rental_place' do
    assign_rental_item = AssignRentalItem.new(
      group: @group,
      rental_item: @rental_item,
      num: 1,
      rental_place: nil
    )
    assert assign_rental_item.valid?
    assert_nil assign_rental_item.rental_place
  end

  test 'should be invalid with non-existent rental_place_id' do
    assign_rental_item = AssignRentalItem.new(
      group: @group,
      rental_item: @rental_item,
      num: 1,
      rental_place_id: 99_999
    )
    assert_not assign_rental_item.valid?
    assert assign_rental_item.errors[:rental_place].present?
  end
end
