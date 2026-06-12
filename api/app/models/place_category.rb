# frozen_string_literal: true

class PlaceCategory < ApplicationRecord
  has_many :stocker_places, dependent: :nullify

  belongs_to :parent, class_name: 'PlaceCategory', optional: true
  has_many :children, class_name: 'PlaceCategory', foreign_key: 'parent_id', dependent: :destroy
end
