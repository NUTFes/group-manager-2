# frozen_string_literal: true

require 'test_helper'

class PlaceOrderTest < ActiveSupport::TestCase
  test 'has multiple assign_group_places' do
    place_order = place_orders(:one)
    first_assignment = assign_group_places(:one)
    second_assignment = AssignGroupPlace.create!(
      place_order: place_order,
      stocker_place: stocker_places(:two)
    )

    assert_equal 2, place_order.assign_group_places.reload.count
    assert_includes place_order.assign_group_places, first_assignment
    assert_includes place_order.assign_group_places, second_assignment
  end
end
