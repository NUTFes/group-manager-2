# frozen_string_literal: true

require 'test_helper'

class HealthCenterSubmissionStatusTest < ActiveSupport::TestCase
  test 'is valid with fixture data' do
    assert health_center_submission_statuses(:food_product_unapproved).valid?
  end

  test 'application_type must be unique per group' do
    duplicate = HealthCenterSubmissionStatus.new(
      group: groups(:one),
      application_type: :food_product,
      status: :approved
    )

    assert_not duplicate.valid?
    assert_includes duplicate.errors[:application_type], 'has already been taken'
  end

  test 'ensure_for_group_and_application_type creates or updates status' do
    status = HealthCenterSubmissionStatus.ensure_for_group_and_application_type!(
      group_id: groups(:two).id,
      application_type: :employee,
      status: :unsubmitted
    )

    assert_equal 'employee', status.application_type
    assert_equal 'unsubmitted', status.status

    updated = HealthCenterSubmissionStatus.ensure_for_group_and_application_type!(
      group_id: groups(:two).id,
      application_type: :employee,
      status: :approved
    )

    assert_equal status.id, updated.id
    assert_equal 'approved', updated.status
  end
end
