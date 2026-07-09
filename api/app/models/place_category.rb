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
      children = children_by_parent_id[parent_id].to_a.sort_by(&:name)
      children.each do |category|
        ordered_categories << category
        append_children.call(category.id)
      end
    end

    append_children.call(nil)
    ordered_categories
  end

  def self.hierarchy_for_index
    categories = order(:id).to_a
    categories_by_id = categories.index_by(&:id)
    children_by_parent_id = categories.group_by(&:parent_id)

    # Calculate descendant_ids for each category without N+1 queries
    descendants_map = {}
    calc_descendants = lambda do |cat_id|
      return descendants_map[cat_id] if descendants_map.key?(cat_id)

      child_ids = children_by_parent_id[cat_id]&.map(&:id) || []
      all_descendants = child_ids.dup
      child_ids.each do |child_id|
        all_descendants.concat(calc_descendants.call(child_id))
      end
      
      descendants_map[cat_id] = all_descendants
    end
    categories.each { |c| calc_descendants.call(c.id) }

    # Batch retrieve stocker_places counts
    stocker_places_counts = StockerPlace.group(:place_category_id).count

    ordered_categories = []
    
    append_children = lambda do |parent_id, ancestor_names|
      children = children_by_parent_id[parent_id].to_a.sort_by(&:name)
      children.each do |category|
        current_ancestor_names = ancestor_names + [category.name]
        parent_name = category.parent_id ? (categories_by_id[category.parent_id]&.name || '未指定') : '未指定'
        desc_ids = descendants_map[category.id]
        
        ordered_categories << category.as_json.merge({
          'formatted_name' => current_ancestor_names.join(' / '),
          'parent_name' => parent_name,
          'children_count' => desc_ids.size,
          'descendant_ids' => desc_ids,
          'stocker_places_count' => stocker_places_counts[category.id] || 0
        })
        append_children.call(category.id, current_ancestor_names)
      end
    end

    append_children.call(nil, [])
    ordered_categories
  end

  def formatted_name
    ancestor_chain.map(&:name).join(' / ')
  end

  def parent_name
    parent ? parent.name : '未指定'
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
