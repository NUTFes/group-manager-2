# frozen_string_literal: true

require 'test_helper'

class Api::V1::OrderInfosApiControllerTest < ActionDispatch::IntegrationTest
  self.fixture_table_names = []

  setup do
    Role.create!(id: 1, name: 'manager')
    @manager = User.create!(
      name: 'order-info-manager',
      email: 'order-info-manager@example.com',
      uid: 'order-info-manager@example.com',
      provider: 'email',
      password: 'password',
      password_confirmation: 'password',
      role_id: 1
    )
    category = GroupCategory.create!(name: '食品販売')
    year = FesYear.create!(year_num: 2026)
    @group = Group.create!(
      name: '電力申請団体',
      project_name: '電力申請企画',
      activity: '活動内容',
      user: @manager,
      group_category: category,
      fes_year: year
    )
  end

  test 'returns total power with order information' do
    PowerOrder.create!(group: @group, item: 'ホットプレート', power: 1200)
    PowerOrder.create!(group: @group, item: '電気ケトル', power: 300)

    get "/api/v1/get_order_info_for_admin_view/#{@group.id}",
        headers: @manager.create_new_auth_token,
        as: :json

    assert_response :success
    assert_equal 1500, response.parsed_body.dig('data', 'total_power')
  end
end
