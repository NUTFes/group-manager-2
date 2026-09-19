# frozen_string_literal: true

class AssignStage < ApplicationRecord
  belongs_to :stage
  belongs_to :stage_order
end
