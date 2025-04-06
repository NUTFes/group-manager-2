# frozen_string_literal: true

class AssignGroupPlace < ApplicationRecord
  belongs_to :place_order
  belongs_to :place
end
