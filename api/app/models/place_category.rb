# frozen_string_literal: true

class PlaceCategory < ApplicationRecord
  has_many :stocker_places, dependent: :nullify

  belongs_to :parent, class_name: 'PlaceCategory', optional: true, inverse_of: :children
  has_many :children, class_name: 'PlaceCategory', foreign_key: 'parent_id', dependent: :restrict_with_error, inverse_of: :parent

  validate :parent_cannot_be_self_or_descendant

  private

  def parent_cannot_be_self_or_descendant
    return if parent_id.nil?

    if parent_id == id
      errors.add(:parent_id, "can't be self")
      return
    end

    current_parent = parent
    while current_parent
      if current_parent.id == id
        errors.add(:parent_id, "can't be a descendant of itself")
        break
      end
      current_parent = current_parent.parent
    end
  end
end
