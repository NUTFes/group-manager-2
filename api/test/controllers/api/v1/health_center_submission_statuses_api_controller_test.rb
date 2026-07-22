# frozen_string_literal: true

require 'test_helper'

class Api::V1::HealthCenterSubmissionStatusesApiControllerTest < ActionDispatch::IntegrationTest
  self.fixture_table_names = []

  setup do
    Role.find_or_create_by!(id: 1, name: 'admin')
    @admin = create_user!(email: 'admin-submission-target@example.com', role_id: 1)
    group_category = GroupCategory.find_or_create_by!(name: '食品販売')
    fes_year = FesYear.find_or_create_by!(year_num: 2026)
    @group = Group.create!(
      name: '技大祭企画',
      project_name: '食品販売',
      activity: '食品販売',
      user: @admin,
      group_category: group_category,
      fes_year: fes_year,
      is_health_center_submission_target: true
    )
  end

  test 'updates submission target flag to false' do
    patch "/api/v1/update_health_center_submission_target/#{@group.id}",
          params: { is_health_center_submission_target: false },
          headers: auth_headers(@admin),
          as: :json

    assert_response :success
    assert_equal false, @group.reload.is_health_center_submission_target
    assert_equal false, response.parsed_body['data']['is_health_center_submission_target']
  end

  test 'updates submission target flag back to true' do
    @group.update!(is_health_center_submission_target: false)

    patch "/api/v1/update_health_center_submission_target/#{@group.id}",
          params: { is_health_center_submission_target: true },
          headers: auth_headers(@admin),
          as: :json

    assert_response :success
    assert @group.reload.is_health_center_submission_target
  end

  test 'requires authentication' do
    patch "/api/v1/update_health_center_submission_target/#{@group.id}",
          params: { is_health_center_submission_target: false },
          as: :json

    assert_response :unauthorized
  end

  private

  def create_user!(email:, role_id:)
    User.create!(
      name: email.split('@').first,
      email: email,
      uid: email,
      provider: 'email',
      password: 'password',
      password_confirmation: 'password',
      role_id: role_id
    )
  end

  def auth_headers(user)
    user.create_new_auth_token
  end
end
