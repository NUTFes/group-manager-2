class StageNumber < ApplicationRecord
  belongs_to :stage
  belongs_to :group_identification
end
