# frozen_string_literal: true

json.extract! employee, :id, :group_id, :name, :student_id, :stool_test_id, :created_at, :updated_at
json.url employee_url(employee, format: :json)
