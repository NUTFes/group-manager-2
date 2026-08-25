# frozen_string_literal: true

require 'test_helper'

class StockerPlaceTest < ActiveSupport::TestCase
  test 'destroys associated assign_group_places' do
    stocker_place = StockerPlace.create!(name: '削除確認用会場')
    assignment = AssignGroupPlace.create!(
      place_order: place_orders(:one),
      stocker_place: stocker_place
    )

    assert_difference('AssignGroupPlace.count', -1) do
      stocker_place.destroy!
    end

    assert_not AssignGroupPlace.exists?(assignment.id)
  end
end
