class StoolTest < ApplicationRecord
  has_one :employee, dependent: :destroy
end
