# frozen_string_literal: true

require 'test_helper'

class HealthCenterSubmissionStatusesUserTest < ActionDispatch::IntegrationTest
  self.fixture_table_names = []

  setup do
    Role.create!(id: 1, name: 'manager')
    Role.create!(id: 2, name: 'staff')
    Role.create!(id: 3, name: 'user')
    @user = create_user!(email: 'status-user@example.com', role_id: 3)
    @other_user = create_user!(email: 'other-status-user@example.com', role_id: 3)
    @staff = create_user!(email: 'status-staff@example.com', role_id: 2)
    @manager = create_user!(email: 'status-manager@example.com', role_id: 1)
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
    @staff_group = Group.create!(
      name: 'スタッフ団体',
      project_name: 'スタッフ企画',
      activity: '展示',
      user: @staff,
      group_category: group_category,
      fes_year: fes_year
    )
  end

  # ログインユーザー自身の団体について、再提出対象の各申請ステータスが取得できることを確認する。
  test 'gets user submission statuses including resubmission application types' do
    get "/health_center_submission_statuses?group_id=#{@group.id}",
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
    get "/health_center_submission_statuses?group_id=#{@other_group.id}",
        headers: auth_headers(@user),
        as: :json

    assert_response :forbidden
  end

  # userが自団体の申請ステータスを未承認状態で新規作成できることを確認する。
  test 'user creates own power order submission status' do
    post '/health_center_submission_statuses',
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

  # userが他団体の申請ステータスを作成できないことを確認する。
  test 'user cannot create another groups submission status' do
    post '/health_center_submission_statuses',
         params: {
           group_id: @other_group.id,
           application_type: 'power_order',
           status: 'unapproved'
         },
         headers: auth_headers(@user),
         as: :json

    assert_response :forbidden
    assert_nil HealthCenterSubmissionStatus.find_by(group: @other_group, application_type: :power_order)
  end

  # staffは閲覧専用のため、自団体の申請ステータスも作成できないことを確認する。
  test 'staff cannot create own submission status' do
    post '/health_center_submission_statuses',
         params: {
           group_id: @staff_group.id,
           application_type: 'power_order',
           status: 'unapproved'
         },
         headers: auth_headers(@staff),
         as: :json

    assert_response :forbidden
    assert_nil HealthCenterSubmissionStatus.find_by(group: @staff_group, application_type: :power_order)
  end

  # managerが他団体の申請ステータスを作成できることを確認する。
  test 'manager creates another groups submission status' do
    post '/health_center_submission_statuses',
         params: {
           group_id: @other_group.id,
           application_type: 'power_order',
           status: 'unapproved'
         },
         headers: auth_headers(@manager),
         as: :json

    assert_response :success
    status = HealthCenterSubmissionStatus.find_by!(group: @other_group, application_type: :power_order)
    assert_equal 'unapproved', status.status
  end

  # このAPIではapprovedにできないことを確認する。
  test 'does not allow creating an approved submission status' do
    post '/health_center_submission_statuses',
         params: {
           group_id: @group.id,
           application_type: 'power_order',
           status: 'approved'
         },
         headers: auth_headers(@manager),
         as: :json

    assert_response :unprocessable_entity
    assert_nil HealthCenterSubmissionStatus.find_by(group: @group, application_type: :power_order)
  end

  # userが自団体の申請ステータスを未承認状態へ戻せることを確認する。
  test 'user updates own fire equipment submission status' do
    submission_status = HealthCenterSubmissionStatus.create!(
      group: @group,
      application_type: :fire_equipment_order,
      status: :waiting_resubmission
    )

    patch "/health_center_submission_statuses/#{submission_status.id}",
          params: { status: 'unapproved' },
          headers: auth_headers(@user).merge('X-Skip-Slack-Notification' => 'true'),
          as: :json

    assert_response :success
    assert_equal 'unapproved', submission_status.reload.status
  end

  # 電力・火器以外の既存再提出申請も、未承認状態へ戻せることを確認する。
  test 'user updates existing resubmission application statuses' do
    (resubmission_application_types - %i[power_order fire_equipment_order]).each do |application_type|
      submission_status = HealthCenterSubmissionStatus.create!(
        group: @group,
        application_type: application_type,
        status: :waiting_resubmission
      )

      patch "/health_center_submission_statuses/#{submission_status.id}",
            params: { status: 'unapproved' },
            headers: auth_headers(@user).merge('X-Skip-Slack-Notification' => 'true'),
            as: :json

      assert_response :success
      assert_equal 'unapproved', submission_status.reload.status
    end
  end

  # userが他団体の申請ステータスを書き換えられないことを確認する。
  test 'user cannot update another groups submission status' do
    submission_status = HealthCenterSubmissionStatus.create!(
      group: @other_group,
      application_type: :fire_equipment_order,
      status: :waiting_resubmission
    )

    patch "/health_center_submission_statuses/#{submission_status.id}",
          params: { status: 'unapproved' },
          headers: auth_headers(@user).merge('X-Skip-Slack-Notification' => 'true'),
          as: :json

    assert_response :forbidden
    assert_equal 'waiting_resubmission', submission_status.reload.status
  end

  # staffは閲覧専用のため、自団体の申請ステータスも書き換えられないことを確認する。
  test 'staff cannot update own submission status' do
    submission_status = HealthCenterSubmissionStatus.create!(
      group: @staff_group,
      application_type: :fire_equipment_order,
      status: :waiting_resubmission
    )

    patch "/health_center_submission_statuses/#{submission_status.id}",
          params: { status: 'unapproved' },
          headers: auth_headers(@staff).merge('X-Skip-Slack-Notification' => 'true'),
          as: :json

    assert_response :forbidden
    assert_equal 'waiting_resubmission', submission_status.reload.status
  end

  # managerが他団体の申請ステータスを書き換えられることを確認する。
  test 'manager updates another groups submission status' do
    submission_status = HealthCenterSubmissionStatus.create!(
      group: @other_group,
      application_type: :fire_equipment_order,
      status: :waiting_resubmission
    )

    patch "/health_center_submission_statuses/#{submission_status.id}",
          params: { status: 'unapproved' },
          headers: auth_headers(@manager).merge('X-Skip-Slack-Notification' => 'true'),
          as: :json

    assert_response :success
    assert_equal 'unapproved', submission_status.reload.status
  end

  # update でもapprovedにできないことを確認する。
  test 'does not allow updating status to approved' do
    submission_status = HealthCenterSubmissionStatus.create!(
      group: @group,
      application_type: :fire_equipment_order,
      status: :waiting_resubmission
    )

    patch "/health_center_submission_statuses/#{submission_status.id}",
          params: { status: 'approved' },
          headers: auth_headers(@manager),
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
      patch "/health_center_submission_statuses/#{submission_status.id}",
            params: { status: 'unapproved' },
            headers: auth_headers(@manager).merge('X-Skip-Slack-Notification' => 'true'),
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
