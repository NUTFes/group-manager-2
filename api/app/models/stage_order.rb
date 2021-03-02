class StageOrder < ApplicationRecord
    belongs_to :group
    belongs_to :fes_date
    has_one :assign_stage, dependent: :destroy
end
