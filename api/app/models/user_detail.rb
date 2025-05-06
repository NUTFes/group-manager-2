class UserDetail < ApplicationRecord
  belongs_to :user
  belongs_to :department
  belongs_to :grade

  # 学籍番号は数字8桁
  validates :student_id,
            format: {
              with: /\A\d{8}\z/,
              message: 'は8桁の数字で入力してください'
            }
  # 学部のIDはdepartmentsテーブルのIDと一致する必要がある
  validates :department_id,
            numericality: {
              only_integer: true,
              greater_than: 0,
              message: 'は正の整数を入力してください'
            }
  # 学年のIDはgradesテーブルのIDと一致する必要がある
  validates :grade_id,
            numericality: {
              only_integer: true,
              greater_than: 0,
              message: 'は正の整数を入力してください'
            }
  # 電話番号はハイフンなしの数字10桁または11桁
  validates :tel,
            format: {
              with: /\A\d{10,11}\z/,
              message: 'はハイフンなしの10桁または11桁の数字で入力してください'
            }

  # バリデーションエラーを日本語で返すメソッドを追加
  def validation_errors
    errors.full_messages.join(', ')
  end

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
