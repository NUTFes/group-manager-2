# frozen_string_literal: true

require 'test_helper'

class StockerPlaceTest < ActiveSupport::TestCase
  fixtures :stocker_places

  test 'display_name returns japanese name by default' do
    place = stocker_places(:with_name_en)
    assert_equal '体育館倉庫', place.display_name
  end

  test 'display_name returns english name when use_english is true' do
    place = stocker_places(:with_name_en)
    assert_equal 'Gymnasium Storage', place.display_name(use_english: true)
  end

  test 'display_name falls back to japanese name when name_en is blank' do
    place = stocker_places(:without_name_en)
    assert_equal '第1体育館前', place.display_name(use_english: true)
  end

  test 'display_name returns empty string when name is nil' do
    place = StockerPlace.new(name: nil)
    assert_equal '', place.display_name
    assert_equal '', place.display_name(use_english: true)
  end
end
