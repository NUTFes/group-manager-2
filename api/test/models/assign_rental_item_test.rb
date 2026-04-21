# frozen_string_literal: true

require 'test_helper'

class AssignRentalItemTest < ActiveSupport::TestCase
  test 'pickup_place prefers rental_place when present' do
    assign_rental_item = assign_rental_items(:one)

    assert_equal stocker_places(:two), assign_rental_item.pickup_place
  end

  test 'pickup_place falls back to stocker_place when rental_place is absent' do
    assign_rental_item = assign_rental_items(:one)
    assign_rental_item.rental_place = nil

    assert_equal stocker_places(:one), assign_rental_item.pickup_place
  end
end
