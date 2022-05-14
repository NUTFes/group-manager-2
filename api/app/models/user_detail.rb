class UserDetail < ApplicationRecord
  belongs_to :user
  belongs_to :department
  belongs_to :grade

  # ユーザー詳細の情報の日本語をハッシュにして返す
  def to_info_h
    return {
      "student_id": self.student_id,
      "department_id": self.department.id,
      "department": self.department.name,
      "grade_id": self.grade_id,
      "grade": self.grade.name,
      "tel": self.tel
    }
  end
end
