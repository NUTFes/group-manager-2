# frozen_string_literal: true

json.array! @employees, partial: 'employees/employee', as: :employee
