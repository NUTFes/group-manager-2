# frozen_string_literal: true

class AssignRentalItem < ApplicationRecord
  belongs_to :group
  belongs_to :rental_item
  belongs_to :stocker_place
  belongs_to :rental_place, class_name: 'StockerPlace', optional: true

  def self.with_groups_and_rental_item
    AssignRentalItem.includes(:group, :rental_item, :stocker_place, :rental_place)
                    .map { |assign_rental_item| build_with_relations(assign_rental_item) }
  end

  def self.with_rental_item(assign_rental_item_id)
    assign_rental_item = AssignRentalItem.includes(
      :group,
      :rental_item,
      :stocker_place,
      :rental_place
    ).find(assign_rental_item_id)
    build_with_relations(assign_rental_item)
  end

  def self.build_with_relations(assign_rental_item)
    {
      assign_rental_item: assign_rental_item,
      rental_item: assign_rental_item.rental_item,
      group: assign_rental_item.group,
      stocker_place: assign_rental_item.stocker_place&.name,
      rental_place: assign_rental_item.rental_place&.name,
      pickup_place: assign_rental_item.pickup_place_name
    }
  end

  def to_rental_item_info_h
    return {
      rental_item: nil? ? nil : self,
      name: rental_item.name,
      is_inside_shop_rentable: rental_item.is_inside_shop_rentable,
      is_outside_shop_rentable: rental_item.is_outside_shop_rentable,
      is_stage_rentable: rental_item.is_stage_rentable,
      num: num
    }
  end

  def pickup_place
    rental_place || stocker_place
  end

  def pickup_place_name
    pickup_place&.name
  end

  def pickup_place_name_en
    pickup_place&.name_en
  end
end
