class Department < ApplicationRecord
  has_many :user_details
  has_many :sub_reps
end
