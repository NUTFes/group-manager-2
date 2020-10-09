json.extract! employee, :id, :group_id, :name, :student_id, :employee_category_id, :created_at, :updated_at
json.url employee_url(employee, format: :json)
