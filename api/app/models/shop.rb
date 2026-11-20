# frozen_string_literal: true

class Shop < ApplicationRecord
  has_many :purchase_lists, dependent: :destroy

  def self.next_regular_id
    regular_ids = where(id: 1...998).pluck(:id)

    (1...998).find { |id| regular_ids.exclude?(id) } ||
      raise(ActiveRecord::RecordNotUnique, 'No available shop id')
  end
end
