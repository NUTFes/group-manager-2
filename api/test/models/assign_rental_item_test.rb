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

  # 書類出力用の場所名
  test 'stock_place_name and rental_place_name return place names' do
    assign_rental_item = AssignRentalItem.new(
      group: @group,
      rental_item: @rental_item,
      num: 1,
      stocker_place: stocker_places(:with_name_en),
      rental_place: stocker_places(:without_name_en)
    )
    assert_equal '体育館倉庫', assign_rental_item.stock_place_name
    assert_equal '第1体育館前', assign_rental_item.rental_place_name
  end

  test 'place names use english with fallback to japanese' do
    assign_rental_item = AssignRentalItem.new(
      group: @group,
      rental_item: @rental_item,
      num: 1,
      stocker_place: stocker_places(:with_name_en),
      rental_place: stocker_places(:without_name_en)
    )
    assert_equal 'Gymnasium Storage', assign_rental_item.stock_place_name(use_english: true)
    # 英語名が未登録なので日本語名にフォールバックする
    assert_equal '第1体育館前', assign_rental_item.rental_place_name(use_english: true)
  end

  test 'stock place name uses japanese when english name is not registered' do
    assign_rental_item = AssignRentalItem.new(
      group: @group,
      rental_item: @rental_item,
      num: 1,
      stocker_place: stocker_places(:without_name_en)
    )
    assert_equal '第1体育館前', assign_rental_item.stock_place_name(use_english: true)
  end

  test 'rental_place_name is blank when rental place is not assigned' do
    assign_rental_item = AssignRentalItem.new(
      group: @group,
      rental_item: @rental_item,
      num: 1,
      stocker_place: stocker_places(:with_name_en),
      rental_place: nil
    )
    assert_equal '', assign_rental_item.rental_place_name
    assert_equal '', assign_rental_item.rental_place_name(use_english: true)
  end

  test 'stock_place_name is blank when stocker place is not assigned' do
    assign_rental_item = AssignRentalItem.new(
      group: @group,
      rental_item: @rental_item,
      num: 1,
      stocker_place: nil
    )
    assert_equal '', assign_rental_item.stock_place_name
    assert_equal '', assign_rental_item.stock_place_name(use_english: true)
  end
end
