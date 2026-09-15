# frozen_string_literal: true

require 'test_helper'

class PlaceCategoryTest < ActiveSupport::TestCase
  self.fixture_table_names = []

  # バリデーション: エリア名が空文字の場合は保存できない。
  test 'requires a non-blank name' do
    place_category = PlaceCategory.new(name: '')

    assert_not place_category.valid?
    assert place_category.errors.added?(:name, :blank)
  end

  # バリデーション: エリア名がnilの場合は保存できない。
  test 'requires a name' do
    place_category = PlaceCategory.new(name: nil)

    assert_not place_category.valid?
    assert place_category.errors.added?(:name, :blank)
  end
end
