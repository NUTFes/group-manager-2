# frozen_string_literal: true

require 'test_helper'

class Api::V1::HealthCenterSubmissionStatusUserTest < ActionDispatch::IntegrationTest
  self.fixture_table_names = []

  setup do
    Role.create!(id: 1, name: 'admin')
    @user = create_user!(email: 'status-user@example.com', role_id: 1)
    group_category = GroupCategory.create!(name: '食品販売')
    fes_year = FesYear.create!(year_num: 2026)
    @group = Group.create!(
      name: '技大祭企画',
      project_name: '電力火器',
      activity: '食品販売',
      user: @user,
      group_category: group_category,
      fes_year: fes_year
    )
  end

  test 'gets user submission statuses including power and fire equipment' do
    get "/api/v1/get_health_center_submission_status_for_user/#{@group.id}",
        headers: auth_headers(@user),
        as: :json

    assert_response :success
    application_types = response.parsed_body.dig('data', 'submissions').map { |submission| submission['application_type'] }

    assert_includes application_types, 'power_order'
    assert_includes application_types, 'fire_equipment_order'
  end

  test 'upserts user power order submission status' do
    post '/api/v1/upsert_health_center_submission_status_for_user',
         params: {
           group_id: @group.id,
           application_type: 'power_order',
           status: 'unapproved'
         },
         headers: auth_headers(@user),
         as: :json

    assert_response :success
    status = HealthCenterSubmissionStatus.find_by!(group: @group, application_type: :power_order)
    assert_equal 'unapproved', status.status
  end

  test 'updates user fire equipment submission status' do
    submission_status = HealthCenterSubmissionStatus.create!(
      group: @group,
      application_type: :fire_equipment_order,
      status: :waiting_resubmission
    )

    patch "/api/v1/update_health_center_submission_status_for_user/#{submission_status.id}",
          params: { status: 'unapproved' },
          headers: auth_headers(@user),
          as: :json

    assert_response :success
    assert_equal 'unapproved', submission_status.reload.status
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
