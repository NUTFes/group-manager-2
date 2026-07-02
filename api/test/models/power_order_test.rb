# frozen_string_literal: true

require 'test_helper'

class PowerOrderTest < ActiveSupport::TestCase
  self.fixture_table_names = []

  setup do
    @group = create_group!
  end

  # 電力申請データ作成時に、対応する申請ステータスが初期作成されることを確認する。
  test 'creates default submission status after create' do
    assert_difference -> { HealthCenterSubmissionStatus.where(group: @group, application_type: :power_order).count }, 1 do
      PowerOrder.create!(
        group: @group,
        item: 'ホットプレート',
        power: 1200,
        manufacturer: 'メーカー',
        model: 'ABC-123',
        item_url: 'https://example.com/item'
      )
    end

    status = HealthCenterSubmissionStatus.find_by(group: @group, application_type: :power_order)
    assert_equal 'unsubmitted', status.status
  end

  private

  def create_group!
    Role.create!(id: 1, name: 'admin')
    user = User.create!(
      name: 'power-order-user',
      email: 'power-order@example.com',
      uid: 'power-order@example.com',
      provider: 'email',
      password: 'password',
      password_confirmation: 'password',
      role_id: 1
    )
    group_category = GroupCategory.create!(name: '食品販売')
    fes_year = FesYear.create!(year_num: 2026)
    Group.create!(
      name: '電力団体',
      project_name: '電力企画',
      activity: '食品販売',
      user: user,
      group_category: group_category,
      fes_year: fes_year
    )
  end
end
