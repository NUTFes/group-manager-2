# frozen_string_literal: true

require 'test_helper'

class HealthCenterSubmissionStatusTest < ActiveSupport::TestCase
  self.fixture_table_names = []

  setup do
    Role.create!(id: 1, name: 'admin')
    user = create_user!(email: 'health-center-status@example.com')
    group_category = GroupCategory.create!(name: '食品販売')
    fes_year = FesYear.create!(year_num: 2026)
    @group = Group.create!(
      name: '技大祭企画',
      project_name: '販売',
      activity: '食品販売',
      user: user,
      group_category: group_category,
      fes_year: fes_year
    )
  end

  # 必須項目が揃っていればステータスレコードとして有効なことを確認する。
  test 'is valid with required data' do
    status = HealthCenterSubmissionStatus.new(
      group: @group,
      application_type: :food_product,
      status: :unapproved
    )

    assert status.valid?
  end

  # 同じ団体・同じ申請種別のステータスを重複作成できないことを確認する。
  test 'application_type must be unique per group' do
    HealthCenterSubmissionStatus.create!(
      group: @group,
      application_type: :food_product,
      status: :unapproved
    )

    duplicate = HealthCenterSubmissionStatus.new(
      group: @group,
      application_type: :food_product,
      status: :approved
    )

    assert_not duplicate.valid?
    assert_not_empty duplicate.errors[:application_type]
  end

  # ensure系APIが未作成なら作成し、既存なら同じレコードを更新することを確認する。
  test 'ensure_for_group_and_application_type creates or updates status' do
    status = HealthCenterSubmissionStatus.ensure_for_group_and_application_type!(
      group_id: @group.id,
      application_type: :employee,
      status: :unsubmitted
    )

    assert_equal 'employee', status.application_type
    assert_equal 'unsubmitted', status.status

    updated = HealthCenterSubmissionStatus.ensure_for_group_and_application_type!(
      group_id: @group.id,
      application_type: :employee,
      status: :approved
    )

    assert_equal status.id, updated.id
    assert_equal 'approved', updated.status
  end

  # 電力申請・火器申請をステータス管理対象として扱えることを確認する。
  test 'application types include power and fire equipment orders' do
    assert_includes HealthCenterSubmissionStatus.application_types.keys, 'power_order'
    assert_includes HealthCenterSubmissionStatus.application_types.keys, 'fire_equipment_order'
  end

  # after_createなどから同時に初期ステータス作成が走っても、ユニーク制約競合で例外化しないことを確認する。
  test 'insert_default_for_group_and_application_type returns existing record on duplicate insert' do
    created = HealthCenterSubmissionStatus.insert_default_for_group_and_application_type!(
      group_id: @group.id,
      application_type: :power_order
    )

    duplicate = HealthCenterSubmissionStatus.insert_default_for_group_and_application_type!(
      group_id: @group.id,
      application_type: :power_order
    )

    assert_equal created.id, duplicate.id
    assert_equal 1, HealthCenterSubmissionStatus.where(group: @group, application_type: :power_order).count
  end

  test 'notifies Slack with the application name for every resubmission type' do
    posted_messages = []
    slack_client = build_slack_client(posted_messages)

    with_slack_client(slack_client) do
      HealthCenterSubmissionStatus::APPLICATION_TYPE_JA.each do |application_type, application_name|
        submission_status = HealthCenterSubmissionStatus.create!(
          group: @group,
          application_type: application_type,
          status: :waiting_resubmission
        )

        assert_difference -> { posted_messages.length }, 1 do
          submission_status.update!(status: :unapproved)
        end
        assert_includes posted_messages.last, "申請種類：#{application_name}"
      end
    end
  end

  test 'does not notify Slack for a status change other than resubmission completion' do
    posted_messages = []
    slack_client = build_slack_client(posted_messages)
    submission_status = HealthCenterSubmissionStatus.create!(
      group: @group,
      application_type: :food_product,
      status: :unapproved
    )

    with_slack_client(slack_client) do
      assert_no_difference -> { posted_messages.length } do
        submission_status.update!(status: :approved)
      end
    end
  end

  private

  def create_user!(email:)
    User.create!(
      name: email.split('@').first,
      email: email,
      uid: email,
      provider: 'email',
      password: 'password',
      password_confirmation: 'password',
      role_id: 1
    )
  end

  def with_slack_client(slack_client)
    original_new = Slack::Web::Client.method(:new)
    Slack::Web::Client.define_singleton_method(:new) { slack_client }

    yield
  ensure
    Slack::Web::Client.define_singleton_method(:new, original_new)
  end

  def build_slack_client(posted_messages)
    Object.new.tap do |slack_client|
      method_name = %w[chat postMessage].join('_').to_sym
      slack_client.define_singleton_method(method_name) do |**args|
        posted_messages << args[:text]
      end
    end
  end
end
