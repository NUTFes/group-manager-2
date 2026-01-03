# frozen_string_literal: true

class FesDate < ApplicationRecord
  belongs_to :fes_year
  has_many :stage_orders, dependent: :destroy
  has_many :purchase_lists, dependent: :destroy
end
