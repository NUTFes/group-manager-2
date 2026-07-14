# frozen_string_literal: true

class Role < ApplicationRecord
  MANAGER_ID = 1
  STAFF_ID = 2
  STAFF_OR_ABOVE_IDS = [MANAGER_ID, STAFF_ID].freeze

  has_many :users, dependent: :destroy
end
