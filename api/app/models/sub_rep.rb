class SubRep < ApplicationRecord
    belongs_to :group
    belongs_to :department
    belongs_to :grade

    # 副代表の情報の日本語をハッシュにして返す
    def to_info_h
      return {
        "name": self.name,
        "department": self.department.name,
        "grade": self.grade.name,
        "tel": self.tel,
        "email": self.email,
        "student_id": self.student_id
      }
    end
end
