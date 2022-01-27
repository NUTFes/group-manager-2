class Employee < ApplicationRecord
  belongs_to :group

  def self.with_groups
    @record = Employee.preload(:group)
      .map{
        |employee|
        {
          "employee": employee,
          "group": employee.group
        }
      }
  end

  def self.with_group(employee_id)
    employee = Employee.find(employee_id)
    return {
      "employee": employee,
      "group": employee.group
    }
  end

  def to_info_h
    return {
      "name": self.name,
      "student_id": self.student_id
    }
  end
end
