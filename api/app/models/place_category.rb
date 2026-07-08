# frozen_string_literal: true

class PlaceCategory < ApplicationRecord
  has_many :stocker_places, dependent: :nullify

  belongs_to :parent, class_name: 'PlaceCategory', optional: true, inverse_of: :children
  has_many :children, class_name: 'PlaceCategory', foreign_key: 'parent_id', dependent: :restrict_with_error, inverse_of: :parent

  validate :parent_cannot_be_self_or_children
  validate :parent_id_must_be_nil_or_integer

  def self.hierarchy_ordered
    categories = order(:id).to_a
    children_by_parent_id = categories.group_by(&:parent_id)
    ordered_categories = []

    append_children = lambda do |parent_id|
      children_by_parent_id[parent_id].to_a.each do |category|
        ordered_categories << category
        append_children.call(category.id)
      end
    end

    append_children.call(nil)
    ordered_categories
  end

  def formatted_name
    ancestor_chain.map(&:name).join(' / ')
  end

  def children_count
    descendant_ids.size
  end

  def descendant_ids
    children.flat_map { |child| [child.id] + child.descendant_ids }
  end

  def stocker_places_count
    stocker_places.size
  end

  private

  def parent_cannot_be_self_or_children
    return if parent_id.nil?

    if parent_id == id
      errors.add(:parent_id, "can't be self")
      return
    end

    current_parent = parent
    while current_parent
      if current_parent.id == id
        errors.add(:parent_id, "can't be a child of itself")
        break
      end
      current_parent = current_parent.parent
    end
  end

  def parent_id_must_be_nil_or_integer
    return unless parent_id_before_type_cast == ''

    errors.add(:parent_id, 'must be nil or integer')
  end

  def ancestor_chain
    chain = [self]
    current = self

    while current.parent
      chain.unshift(current.parent)
      current = current.parent
    end

    chain
  end
end
