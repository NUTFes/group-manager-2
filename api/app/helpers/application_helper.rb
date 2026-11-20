# frozen_string_literal: true

module ApplicationHelper
  # student_idからユーザータイプ（学外/教職員/学生）を判定して返す
  def user_category_label(student_id)
    return '学外' if student_id == UserDetail::STUDENT_ID_EXTERNAL
    return '教職員' if student_id == UserDetail::STUDENT_ID_STAFF

    '学生'
  end
end
