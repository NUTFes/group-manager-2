class Role < ApplicationRecord
  has_many :users, dependent: :destroy
end
