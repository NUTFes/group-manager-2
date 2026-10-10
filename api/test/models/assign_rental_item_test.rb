# frozen_string_literal: true

require 'test_helper'

class AssignRentalItemTest < ActiveSupport::TestCase
  fixtures :groups, :rental_items, :stocker_places

  def setup
    @group = groups(:one)
    @rental_item = rental_items(:one)
    @stocker_place = stocker_places(:one)
  end

  # 超過貸出の上限に使う集計。割当変更（addition/reduction）と貸出済を織り込む
  test 'unlent_quantity_for accounts for assignment changes and what is already lent out' do
    place = stocker_places(:without_name_en)
    assignment = AssignRentalItem.create!(
      group: @group, rental_item: @rental_item, stocker_place: place, num: 10
    )
    ItemRentalLog.create!(
      uid: 'unlent-rental-uid', assign_rental_item: assignment, group: @group,
      rental_item: @rental_item, stocker_place: place,
      category: :rental, quantity: 3, recorder_email: 'recorder@example.com'
    )
    ItemRentalLog.create!(
      uid: 'unlent-reduction-uid', group: @group,
      rental_item: @rental_item, stocker_place: place,
      category: :reduction, quantity: 2, recorder_email: 'recorder@example.com'
    )

    # 実効割当数 10 - 2 = 8、貸出済 3 なので未貸出数は 5
    assert_equal 5, AssignRentalItem.unlent_quantity_for(
      group_id: @group.id, rental_item_id: @rental_item.id, stocker_place_id: place.id
    )
  end

  # 割当変更ログと記録をまとめて引くため、割当の件数によらずクエリ数は変わらない
  test 'unlent_quantity_for issues a constant number of queries' do
    place = stocker_places(:without_name_en)
    AssignRentalItem.create!(
      group: @group, rental_item: @rental_item, stocker_place: place, num: 5
    )

    queries = 0
    counter = lambda { |_name, _start, _finish, _id, payload|
      queries += 1 unless payload[:name].in?(%w[SCHEMA TRANSACTION CACHE])
    }
    ActiveSupport::Notifications.subscribed(counter, 'sql.active_record') do
      AssignRentalItem.unlent_quantity_for(
        group_id: @group.id, rental_item_id: @rental_item.id, stocker_place_id: place.id
      )
    end

    # 割当・割当変更ログ・記録の3クエリで済む
    assert_equal 3, queries
  end

  # 同一(group_id, stocker_place_id, rental_item_id)の重複はDBの一意インデックスで弾く
  test 'db rejects a duplicate group / stocker_place / rental_item combination' do
    attrs = {
      group: @group,
      rental_item: @rental_item,
      stocker_place: stocker_places(:with_name_en),
      num: 1
    }
    AssignRentalItem.create!(attrs)

    assert_raises(ActiveRecord::RecordNotUnique) do
      AssignRentalItem.create!(attrs.merge(num: 2))
    end
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
    assert_equal 'Gymnasium Storage', assign_rental_item.stock_place_name(locale: :en)
    # 英語名が未登録なので日本語名にフォールバックする
    assert_equal '第1体育館前', assign_rental_item.rental_place_name(locale: :en)
  end

  test 'stock place name uses japanese when english name is not registered' do
    assign_rental_item = AssignRentalItem.new(
      group: @group,
      rental_item: @rental_item,
      num: 1,
      stocker_place: stocker_places(:without_name_en)
    )
    assert_equal '第1体育館前', assign_rental_item.stock_place_name(locale: :en)
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
    assert_equal '', assign_rental_item.rental_place_name(locale: :en)
  end

  test 'stock_place_name is blank when stocker place is not assigned' do
    assign_rental_item = AssignRentalItem.new(
      group: @group,
      rental_item: @rental_item,
      num: 1,
      stocker_place: nil
    )
    assert_equal '', assign_rental_item.stock_place_name
    assert_equal '', assign_rental_item.stock_place_name(locale: :en)
  end

  test 'destroy is blocked while item_rental_logs exist' do
    assign_rental_item = assign_rental_items(:one)

    assert_not assign_rental_item.destroy
    assert assign_rental_item.errors[:base].present?
    assert AssignRentalItem.exists?(assign_rental_item.id)
  end
end
