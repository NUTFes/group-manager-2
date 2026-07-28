# frozen_string_literal: true

require 'test_helper'

class RentalOrderTest < ActiveSupport::TestCase
  self.fixture_table_names = []

  setup do
    Role.create!(id: 1, name: 'manager')
    user = User.create!(
      name: 'rental-order-user',
      email: 'rental-order@example.com',
      uid: 'rental-order@example.com',
      provider: 'email',
      password: 'password',
      password_confirmation: 'password',
      role_id: 1
    )
    category = GroupCategory.create!(name: '食品販売')
    year = FesYear.create!(year_num: 2026)
    @group = Group.create!(
      name: '物品申請団体',
      project_name: '物品申請企画',
      activity: '活動内容',
      user: user,
      group_category: category,
      fes_year: year
    )
    @rental_item = RentalItem.create!(name: '長机')
  end

  test 'removes conflicting unregistered flag after create' do
    UnRegisteredGroup.create!(group: @group, order_type: :rental_item_order)

    assert_difference -> { @group.un_registered_groups.rental_item_order.count }, -1 do
      RentalOrder.create!(group: @group, rental_item: @rental_item, num: 1)
    end
  end
end
