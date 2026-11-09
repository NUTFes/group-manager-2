# frozen_string_literal: true

class PlaceNumber < ApplicationRecord
  belongs_to :place
  belongs_to :group_identification
end
