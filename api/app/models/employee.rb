class Employee < ApplicationRecord
  belongs_to :group
  belongs_to :stool_test

  def self.with_groups
    @record = Employee.preload(:group)
      .map{
        |employee|
        {
          "employee": employee,
          "group": employee.group,
          "stool_test": employee.stool_test
        }
      }
  end

  def self.with_group(employee_id)
    employee = Employee.find(employee_id)
    return {
      "employee": employee,
      "group": employee.group,
      "stool_test": employee.stool_test
    }
  end

  def to_info_h
    return {
      "id": self.id,
      "name": self.name,
      "student_id": self.student_id,
      "stool_test": self.stool_test.status
    }
  end
end
