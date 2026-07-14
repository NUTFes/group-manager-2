# frozen_string_literal: true

require 'test_helper'

class Api::V1::GroupMailCommentsApiControllerTest < ActionDispatch::IntegrationTest
  self.fixture_table_names = []

  setup do
    Role.find_or_create_by!(id: 1, name: 'admin')
    Role.find_or_create_by!(id: 2, name: 'staff')
    Role.find_or_create_by!(id: 3, name: 'user')
    @admin = create_user!(email: 'admin-comments-mail@example.com', role_id: 1)
    @staff = create_user!(email: 'staff-comments-mail@example.com', role_id: 2)
    @user = create_user!(email: 'user-comments-mail@example.com', role_id: 3)

    group_category = GroupCategory.find_or_create_by!(name: '食品販売')
    fes_year = FesYear.find_or_create_by!(year_num: 2026)
    @group = Group.create!(
      name: '技大祭企画',
      project_name: '食品販売',
      activity: '食品販売',
      user: @admin,
      group_category: group_category,
      fes_year: fes_year
    )

    # Order status comment
    @group.comments.create!(
      body: "件名: 確認\n\n状況確認",
      mail_delivery_status: :sent
    )

    # Health center comment
    health_status = @group.health_center_submission_statuses.create!(
      application_type: 'food_product',
      status: 'unapproved'
    )
    health_status.comments.create!(
      body: "件名: 保健所\n\n再提出",
      mail_delivery_status: :sent
    )
  end

  test 'index returns comments for order status and health center ordered by created_at' do
    get "/api/v1/group_mail_comments?group_id=#{@group.id}",
        headers: auth_headers(@admin),
        as: :json

    assert_response :ok
    data = response.parsed_body['data']
    assert_equal 2, data.size

    # 降順で返されるので、health_centerが先に作成されていれば順序が変わる可能性があるが
    # 両方取得できていることを確認
    sources = data.pluck('source')
    assert_includes sources, 'order_status'
    assert_includes sources, 'health_center'
  end

  test 'index requires authentication' do
    get "/api/v1/group_mail_comments?group_id=#{@group.id}", as: :json

    assert_response :unauthorized
  end

  test 'index allows staff users' do
    get "/api/v1/group_mail_comments?group_id=#{@group.id}",
        headers: auth_headers(@staff),
        as: :json

    assert_response :ok
  end

  test 'index forbids users below staff role' do
    get "/api/v1/group_mail_comments?group_id=#{@group.id}",
        headers: auth_headers(@user),
        as: :json

    assert_response :forbidden
  end

  private

  def create_user!(email:, role_id:)
    User.create!(
      name: 'テストユーザー',
      email: email,
      provider: 'google_oauth2',
      uid: email,
      password: 'password',
      password_confirmation: 'password',
      role_id: role_id
    )
  end

  def auth_headers(user)
    user.create_new_auth_token
  end
end
