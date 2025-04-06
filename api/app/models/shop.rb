# frozen_string_literal: true

class Shop < ApplicationRecord
  has_many :purchase_lists
end
