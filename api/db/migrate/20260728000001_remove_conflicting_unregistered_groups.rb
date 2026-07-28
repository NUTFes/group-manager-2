# frozen_string_literal: true

class RemoveConflictingUnregisteredGroups < ActiveRecord::Migration[6.1]
  def up
    execute <<~SQL.squish
      DELETE unregistered_groups
      FROM un_registered_groups AS unregistered_groups
      WHERE
        (
          unregistered_groups.order_type = 0
          AND EXISTS (
            SELECT 1
            FROM rental_orders
            WHERE rental_orders.group_id = unregistered_groups.group_id
          )
        )
        OR (
          unregistered_groups.order_type = 1
          AND EXISTS (
            SELECT 1
            FROM power_orders
            WHERE power_orders.group_id = unregistered_groups.group_id
          )
        )
        OR (
          unregistered_groups.order_type = 4
          AND EXISTS (
            SELECT 1
            FROM fire_equipment_orders
            WHERE fire_equipment_orders.group_id = unregistered_groups.group_id
          )
        )
    SQL
  end

  def down
    # 申請データと矛盾する「申請しない」回答は復元しない。
  end
end
