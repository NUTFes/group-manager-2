class Employee < ApplicationRecord
    belongs_to :group

    def to_info_h
      return {
        "name": self.name,
        "student_id": self.student_id
      }
    end
end
