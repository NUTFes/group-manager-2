# frozen_string_literal: true

class GroupIdentification < ApplicationRecord
  belongs_to :group
  has_one :place_number, dependent: :destroy
  has_one :stage_number, dependent: :destroy
end
