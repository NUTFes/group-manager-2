# frozen_string_literal: true

require 'set'

# Mocks
GroupMock = Struct.new(:id, :name, :employees, :user, :sub_rep)
EmployeeMock = Struct.new(:name, :student_id)
UserMock = Struct.new(:name, :user_detail)
UserDetailMock = Struct.new(:student_id)

# Test case: 2 regular students, diff ID, same name
# Test case: 99999999 staff
UserDetail_STUDENT_ID_EXTERNAL = 88888888
UserDetail_STUDENT_ID_STAFF = 99999999

def test_logic(groups)
  persons = []
  group_dup_student_ids = Hash.new { |h, k| h[k] = Set.new }
  group_dup_names = Hash.new { |h, k| h[k] = Set.new }

  groups.each do |group|
    rep = group.user
    rep_norm = nil
    rep_student = nil
    group_seen_student_ids = Set.new
    group_seen_norm_and_id = Set.new

    if rep
      rep_norm = rep.name.to_s.gsub(/[[:space:]\u3000]+/, '')
      rep_student = rep.user_detail&.student_id
      group_seen_student_ids << rep_student if rep_student.present?
      group_seen_norm_and_id << [rep_norm, rep_student] if rep_norm.present?
      persons << { group_id: group.id, group: group.name, name: rep.name.to_s, student_id: rep_student, roles: ['代'] }
    end

    sub_rep = group.sub_rep
    if sub_rep
      sub_rep_norm = sub_rep.name.to_s.gsub(/[[:space:]\u3000]+/, '')
      sub_rep_student = sub_rep.student_id
      group_seen_student_ids << sub_rep_student if sub_rep_student.present?
      group_seen_norm_and_id << [sub_rep_norm, sub_rep_student] if sub_rep_norm.present?
      persons << { group_id: group.id, group: group.name, name: sub_rep.name.to_s, student_id: sub_rep_student, roles: ['副'] }
    end

    (group.employees || []).each do |employee|
      emp_name = employee.name.to_s
      emp_norm = emp_name.gsub(/[[:space:]\u3000]+/, '')
      emp_student = employee.student_id
      common_student_ids = [UserDetail_STUDENT_ID_EXTERNAL, UserDetail_STUDENT_ID_STAFF]

      student_id_dup_check_target = !emp_student.nil? && emp_student.to_s != '' && !common_student_ids.include?(emp_student)

      if student_id_dup_check_target && group_seen_student_ids.include?(emp_student)
        group_dup_student_ids[group.id] << emp_student
        next
      elsif !student_id_dup_check_target && emp_norm != '' && group_seen_norm_and_id.include?([emp_norm, emp_student])
        group_dup_names[group.id] << [emp_norm, emp_student]
        next
      end

      persons << { group_id: group.id, group: group.name, name: emp_name, student_id: emp_student, roles: [] }
      group_seen_student_ids << emp_student if emp_student
      group_seen_norm_and_id << [emp_norm, emp_student] if emp_norm != ''
    end
  end
  persons
end

# Test 1: Same name, different IDs
g1 = GroupMock.new(1, 'Group 1', [
                     EmployeeMock.new('山田太郎', 11111111),
                     EmployeeMock.new('山田太郎', 22222222)
                   ], nil, nil)

# Test 2: 99999999
g2 = GroupMock.new(2, 'Group 2', [
                     EmployeeMock.new('教員A', 99999999),
                     EmployeeMock.new('教員B', 99999999)
                   ], nil, nil)

puts test_logic([g1, g2]).inspect
