# frozen_string_literal: true

class StoolTest < ApplicationRecord
  has_one :employee, dependent: :destroy
end
