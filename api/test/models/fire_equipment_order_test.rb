# frozen_string_literal: true

require 'test_helper'

class FireEquipmentOrderTest < ActiveSupport::TestCase
  self.fixture_table_names = []

  setup do
    @group = create_group!
  end

  # 火器申請データ作成時に、対応する申請ステータスが初期作成されることを確認する。
  test 'creates default submission status after create' do
    assert_difference -> { HealthCenterSubmissionStatus.where(group: @group, application_type: :fire_equipment_order).count }, 1 do
      FireEquipmentOrder.create!(
        group: @group,
        name: 'カセットコンロ',
        quantity: 1,
        fuel: :gas_bottle,
        usage: '調理',
        is_takeaway: false,
        remark: ''
      )
    end

    status = HealthCenterSubmissionStatus.find_by(group: @group, application_type: :fire_equipment_order)
    assert_equal 'unapproved', status.status
  end

  test 'removes conflicting unregistered flag after create' do
    UnRegisteredGroup.create!(group: @group, order_type: :fire_equipment_order)

    assert_difference -> { @group.un_registered_groups.fire_equipment_order.count }, -1 do
      FireEquipmentOrder.create!(
        group: @group,
        name: 'カセットコンロ',
        quantity: 1,
        fuel: :gas_bottle
      )
    end
  end

  private

  def create_group!
    Role.create!(id: 1, name: 'admin')
    user = User.create!(
      name: 'fire-equipment-user',
      email: 'fire-equipment@example.com',
      uid: 'fire-equipment@example.com',
      provider: 'email',
      password: 'password',
      password_confirmation: 'password',
      role_id: 1
    )
    group_category = GroupCategory.create!(name: '食品販売')
    fes_year = FesYear.create!(year_num: 2026)
    Group.create!(
      name: '火器団体',
      project_name: '火器企画',
      activity: '食品販売',
      user: user,
      group_category: group_category,
      fes_year: fes_year
    )
  end
end
