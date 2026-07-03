# frozen_string_literal: true

class Employee < ApplicationRecord
  belongs_to :group
  belongs_to :stool_test

  after_create :ensure_health_center_submission_status

  def self.with_groups
    @record = Employee.preload(:group)
      .map do |employee|
      {
        employee: employee,
        group: employee.group,
        stool_test: employee.stool_test
      }
    end
  end

  def self.with_group(employee_id)
    employee = Employee.find(employee_id)
    return {
      employee: employee,
      group: employee.group,
      stool_test: employee.stool_test
    }
  end

  def to_info_h
    return {
      id: id,
      name: name,
      student_id: student_id,
      stool_test: stool_test.status
    }
  end

  private

  def ensure_health_center_submission_status
    HealthCenterSubmissionStatus.insert_default_for_group_and_application_type!(
      group_id: group_id,
      application_type: :employee,
      status: :unapproved
    )
  end
end
