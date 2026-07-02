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

  test 'is valid with required data' do
    status = HealthCenterSubmissionStatus.new(
      group: @group,
      application_type: :food_product,
      status: :unapproved
    )

    assert status.valid?
  end

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

  test 'application types include power and fire equipment orders' do
    assert_includes HealthCenterSubmissionStatus.application_types.keys, 'power_order'
    assert_includes HealthCenterSubmissionStatus.application_types.keys, 'fire_equipment_order'
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
end
