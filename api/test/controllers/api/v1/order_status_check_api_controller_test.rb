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
    food_category = GroupCategory.create!(name: '食品販売')
    stage_category = GroupCategory.create!(name: 'ステージ')
    exhibition_category = GroupCategory.create!(name: '展示・体験')
    committee_category = GroupCategory.create!(name: '実行委員')
    year = FesYear.create!(year_num: 2026)
    @committee_group = create_group!(
      name: 'D-実行委員',
      committee: true,
      category: committee_category,
      year: year
    )
    @international_group = create_group!(
      name: 'A-国際',
      category: exhibition_category,
      year: year,
      is_international: true
    )
    @food_group = create_group!(
      name: 'B-食品',
      category: food_category,
      year: year
    )
    @participant_group = create_group!(
      name: 'C-ステージ',
      category: stage_category,
      year: year
    )
  end

  test 'filters order status groups by committee flag' do
    assert_equal [@committee_group.id], refined_group_ids(committee: 1)
    assert_equal [@international_group.id, @food_group.id, @participant_group.id].sort,
                 refined_group_ids(committee: 2).sort
    assert_equal [@committee_group.id, @international_group.id, @food_group.id, @participant_group.id].sort,
                 refined_group_ids(committee: 0).sort
  end

  test 'returns section and name sort orders' do
    post_refinement

    assert_equal [@committee_group.id, @international_group.id, @food_group.id, @participant_group.id],
                 response.parsed_body.dig('sort_orders', 'section')
    assert_equal [@international_group.id, @food_group.id, @participant_group.id, @committee_group.id],
                 response.parsed_body.dig('sort_orders', 'name')
  end

  private

  def create_group!(name:, category:, year:, committee: false, is_international: false)
    Group.create!(
      name: name,
      project_name: "#{name}企画",
      activity: '活動内容',
      user: @manager,
      group_category: category,
      fes_year: year,
      committee: committee,
      is_international: is_international
    )
  end

  def refined_group_ids(committee:)
    post_refinement(committee: committee)
    response.parsed_body.fetch('data').map { |group| group.dig('group', 'id') }
  end

  def post_refinement(committee: 0)
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
  end
end
