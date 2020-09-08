class Group < ApplicationRecord
    belongs_to :user
    belongs_to :fes_year
    belongs_to :group_category
end
