# frozen_string_literal: true

class GroupCategory < ApplicationRecord
  has_many :groups, dependent: :destroy
  has_many :place_allow_lists, dependent: :destroy
  has_many :rental_item_allow_lists, dependent: :destroy
end
