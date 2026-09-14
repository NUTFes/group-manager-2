# frozen_string_literal: true

require 'test_helper'

class ItemRentalLogTest < ActiveSupport::TestCase
  setup do
    @stocker_place = stocker_places(:one)
    @rental_item = rental_items(:one)
    @assign_rental_item = assign_rental_items(:one)
  end

  def build_log(attrs = {})
    ItemRentalLog.new(
      {
        uid: 'model-test-uid',
        assign_rental_item: @assign_rental_item,
        stocker_place: @stocker_place,
        rental_item: @rental_item,
        category: :rental,
        quantity: 1,
        recorder_email: 'recorder@example.com'
      }.merge(attrs)
    )
  end

  test 'valid with required attributes' do
    assert build_log.valid?
  end

  test 'invalid without assign_rental_item' do
    log = build_log(assign_rental_item: nil)
    assert_not log.valid?
  end

  test 'invalid without stocker_place' do
    log = build_log(stocker_place: nil)
    assert_not log.valid?
  end

  test 'invalid with duplicate uid' do
    build_log(uid: item_rental_logs(:one).uid).save
    duplicate = build_log(uid: item_rental_logs(:one).uid)
    assert_not duplicate.valid?
    assert duplicate.errors.of_kind?(:uid, :taken)
  end

  test 'invalid with negative quantity' do
    log = build_log(quantity: -1)
    assert_not log.valid?
  end

  test 'invalid with unknown category' do
    assert_raises(ArgumentError) { build_log(category: 'unknown') }
  end
end
