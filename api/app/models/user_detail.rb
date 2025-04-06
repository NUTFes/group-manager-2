class UserDetail < ApplicationRecord
  belongs_to :user
  belongs_to :department
  belongs_to :grade

  # ユーザー詳細の情報の日本語をハッシュにして返す
  def to_info_h
    {
      "student_id": student_id,
      "department_id": department.id,
      "department": department.name,
      "grade_id": grade_id,
      "grade": grade.name,
      "tel": tel
    }
  end
end
