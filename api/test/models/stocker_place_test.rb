# frozen_string_literal: true

require 'test_helper'

class StockerPlaceTest < ActiveSupport::TestCase
  fixtures :stocker_places

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

  test 'display_name returns japanese name by default' do
    place = stocker_places(:with_name_en)
    assert_equal '体育館倉庫', place.display_name
  end

  test 'display_name returns english name when locale is en' do
    place = stocker_places(:with_name_en)
    assert_equal 'Gymnasium Storage', place.display_name(locale: :en)
  end

  # params[:locale] は文字列で渡ってくる場合があるため、記号でも文字列でも同じ結果になること
  test 'display_name accepts locale given as a string' do
    place = stocker_places(:with_name_en)
    assert_equal 'Gymnasium Storage', place.display_name(locale: 'en')
  end

  test 'display_name falls back to japanese name when name_en is blank' do
    place = stocker_places(:without_name_en)
    assert_equal '第1体育館前', place.display_name(locale: :en)
  end

  test 'display_name returns empty string when name is nil' do
    place = StockerPlace.new(name: nil)
    assert_equal '', place.display_name
    assert_equal '', place.display_name(locale: :en)
  end

  # StockerPlaceの直接のitem_rental_logsだけでなく、
  # dependent: :destroyで連鎖するassign_rental_itemsがitem_rental_logsを持つ場合も削除できないこと
  test 'destroy is blocked while a dependent assign_rental_item has item_rental_logs' do
    place = stocker_places(:one)
    assign_rental_item = assign_rental_items(:one)

    assert_not place.destroy
    assert StockerPlace.exists?(place.id)
    assert AssignRentalItem.exists?(assign_rental_item.id)
  end
end
