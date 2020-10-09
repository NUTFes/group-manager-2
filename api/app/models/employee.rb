class Employee < ApplicationRecord
    belongs_to :group
    belongs_to :employee_category
end
