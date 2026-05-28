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
    assert duplicate.errors[:application_type].present?
  end
end
