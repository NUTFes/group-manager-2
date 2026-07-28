# frozen_string_literal: true

require 'test_helper'

class Api::V1::OrderStatusCheckApiControllerTest < ActionDispatch::IntegrationTest
  self.fixture_table_names = []

  setup do
    Role.create!(id: 1, name: 'manager')
    @manager = User.create!(
      name: 'order-status-manager',
      email: 'order-status-manager@example.com',
      uid: 'order-status-manager@example.com',
      provider: 'email',
      password: 'password',
      password_confirmation: 'password',
      role_id: 1
    )
    category = GroupCategory.create!(name: '食品販売')
    year = FesYear.create!(year_num: 2026)
    @committee_group = create_group!(
      name: '実行委員会団体',
      committee: true,
      category: category,
      year: year
    )
    @participant_group = create_group!(
      name: '一般参加団体',
      committee: false,
      category: category,
      year: year
    )
  end

  test 'filters order status groups by committee flag' do
    assert_equal [@committee_group.id], refined_group_ids(committee: 1)
    assert_equal [@participant_group.id], refined_group_ids(committee: 2)
    assert_equal [@committee_group.id, @participant_group.id].sort,
                 refined_group_ids(committee: 0).sort
  end

  private

  def create_group!(name:, committee:, category:, year:)
    Group.create!(
      name: name,
      project_name: "#{name}企画",
      activity: '活動内容',
      user: @manager,
      group_category: category,
      fes_year: year,
      committee: committee
    )
  end

  def refined_group_ids(committee:)
    post '/api/v1/get_refinement_order_status_check',
         params: {
           fes_year_id: 0,
           group_category_id: 0,
           committee: committee,
           is_international: 0,
           is_external: 0
         },
         headers: @manager.create_new_auth_token,
         as: :json

    assert_response :success
    response.parsed_body.fetch('data').map { |group| group.dig('group', 'id') }
  end
end
