class UserDetail < ApplicationRecord
  belongs_to :user
  belongs_to :department
  belongs_to :grade
end
