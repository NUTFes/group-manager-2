json.extract! user_detail, :id, :tel, :grade_id, :department_id, :user_id, :created_at, :updated_at
json.url user_detail_url(user_detail, format: :json)
