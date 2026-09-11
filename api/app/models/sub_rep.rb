# frozen_string_literal: true

class SubRep < ApplicationRecord
  belongs_to :group
  belongs_to :department
  belongs_to :grade

  # 副代表の情報の日本語をハッシュにして返す
  def to_info_h
    return {
      id: id,
      name: name,
      department: department.name,
      department_id: department.id,
      grade: grade.name,
      grade_id: grade.id,
      tel: tel,
      email: email,
      student_id: student_id
    }
  end
end
