# frozen_string_literal: true

require 'test_helper'

class HealthCenterSubmissionStatusesUserTest < ActionDispatch::IntegrationTest
  self.fixture_table_names = []

  setup do
    Role.create!(id: 1, name: 'admin')
    @user = create_user!(email: 'status-user@example.com', role_id: 1)
    @other_user = create_user!(email: 'other-status-user@example.com', role_id: 1)
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
    @other_group = Group.create!(
      name: '別団体',
      project_name: '別企画',
      activity: '展示',
      user: @other_user,
      group_category: group_category,
      fes_year: fes_year
    )
  end

  # ログインユーザー自身の団体について、再提出対象の各申請ステータスが取得できることを確認する。
  test 'gets user submission statuses including resubmission application types' do
    get "/health_center_submission_statuses/user/#{@group.id}",
        headers: auth_headers(@user),
        as: :json

    assert_response :success
    application_types = response.parsed_body.dig('data', 'submissions').pluck('application_type')

    resubmission_application_types.each do |application_type|
      assert_includes application_types, application_type.to_s
    end
  end

  # 他ユーザーの団体IDを指定しても、申請ステータスを閲覧できないことを確認する。
  test 'does not get another users submission statuses' do
    get "/health_center_submission_statuses/user/#{@other_group.id}",
        headers: auth_headers(@user),
        as: :json

    assert_response :not_found
  end

  # ログインユーザー自身の団体について、user用APIから電力申請を未承認状態へ更新できることを確認する。
  test 'upserts user power order submission status' do
    post '/health_center_submission_statuses/user/upsert',
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

  # user用upsert APIで他ユーザーの団体ステータスを作成・更新できないことを確認する。
  test 'does not upsert another users submission status' do
    post '/health_center_submission_statuses/user/upsert',
         params: {
           group_id: @other_group.id,
           application_type: 'power_order',
           status: 'unapproved'
         },
         headers: auth_headers(@user),
         as: :json

    assert_response :not_found
    assert_nil HealthCenterSubmissionStatus.find_by(group: @other_group, application_type: :power_order)
  end

  # user用APIではapprovedへの自己承認ができないことを確認する。
  test 'does not allow user to approve own submission status' do
    post '/health_center_submission_statuses/user/upsert',
         params: {
           group_id: @group.id,
           application_type: 'power_order',
           status: 'approved'
         },
         headers: auth_headers(@user),
         as: :json

    assert_response :unprocessable_entity
    assert_nil HealthCenterSubmissionStatus.find_by(group: @group, application_type: :power_order)
  end

  # ログインユーザー自身の団体について、再提出後に火器申請を未承認状態へ戻せることを確認する。
  test 'updates user fire equipment submission status' do
    submission_status = HealthCenterSubmissionStatus.create!(
      group: @group,
      application_type: :fire_equipment_order,
      status: :waiting_resubmission
    )

    patch "/health_center_submission_statuses/user/#{submission_status.id}",
          params: { status: 'unapproved' },
          headers: auth_headers(@user).merge('X-Skip-Slack-Notification' => 'true'),
          as: :json

    assert_response :success
    assert_equal 'unapproved', submission_status.reload.status
  end

  # 電力・火器以外の既存再提出申請も、共通のuser用APIから未承認状態へ戻せることを確認する。
  test 'updates existing resubmission application statuses through user api' do
    (resubmission_application_types - %i[power_order fire_equipment_order]).each do |application_type|
      submission_status = HealthCenterSubmissionStatus.create!(
        group: @group,
        application_type: application_type,
        status: :waiting_resubmission
      )

      patch "/health_center_submission_statuses/user/#{submission_status.id}",
            params: { status: 'unapproved' },
            headers: auth_headers(@user).merge('X-Skip-Slack-Notification' => 'true'),
            as: :json

      assert_response :success
      assert_equal 'unapproved', submission_status.reload.status
    end
  end

  # user用update APIで他ユーザーの団体ステータスを書き換えられないことを確認する。
  test 'does not update another users submission status' do
    submission_status = HealthCenterSubmissionStatus.create!(
      group: @other_group,
      application_type: :fire_equipment_order,
      status: :waiting_resubmission
    )

    patch "/health_center_submission_statuses/user/#{submission_status.id}",
          params: { status: 'unapproved' },
          headers: auth_headers(@user).merge('X-Skip-Slack-Notification' => 'true'),
          as: :json

    assert_response :not_found
    assert_equal 'waiting_resubmission', submission_status.reload.status
  end

  # user用update APIでもapprovedへの自己承認ができないことを確認する。
  test 'does not allow user to update status to approved' do
    submission_status = HealthCenterSubmissionStatus.create!(
      group: @group,
      application_type: :fire_equipment_order,
      status: :waiting_resubmission
    )

    patch "/health_center_submission_statuses/user/#{submission_status.id}",
          params: { status: 'approved' },
          headers: auth_headers(@user),
          as: :json

    assert_response :unprocessable_entity
    assert_equal 'waiting_resubmission', submission_status.reload.status
  end

  # E2Eなどの非productionテストでは、専用ヘッダーでSlack再提出通知を抑止できることを確認する。
  test 'skip slack notification header suppresses resubmission notification' do
    submission_status = HealthCenterSubmissionStatus.create!(
      group: @group,
      application_type: :fire_equipment_order,
      status: :waiting_resubmission
    )

    with_slack_client_new_raising do
      patch "/health_center_submission_statuses/user/#{submission_status.id}",
            params: { status: 'unapproved' },
            headers: auth_headers(@user).merge('X-Skip-Slack-Notification' => 'true'),
            as: :json
    end

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

  def resubmission_application_types
    %i[
      equipment
      employee
      food_product
      purchase_list
      venue_map
      cooking_process_order
      power_order
      fire_equipment_order
    ]
  end

  def with_slack_client_new_raising
    original_new = Slack::Web::Client.method(:new)
    Slack::Web::Client.define_singleton_method(:new) do
      raise 'Slack notification should be skipped'
    end

    yield
  ensure
    Slack::Web::Client.define_singleton_method(:new, original_new)
  end
end
