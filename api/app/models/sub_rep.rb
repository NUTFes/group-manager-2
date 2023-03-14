class SubRep < ApplicationRecord
    belongs_to :group
    belongs_to :department
    belongs_to :grade

    # 副代表の情報の日本語をハッシュにして返す
    def to_info_h
      return {
        "id": self.id,
        "name": self.name,
        "department": self.department.name,
        "department_id": self.department.id,
        "grade": self.grade.name,
        "grade_id": self.grade.id,
        "tel": self.tel,
        "email": self.email,
        "student_id": self.student_id
      }
    end
end
