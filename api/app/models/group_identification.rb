# frozen_string_literal: true

class GroupIdentification < ApplicationRecord
  belongs_to :group
  has_one :place_number
  has_one :stage_number
end
