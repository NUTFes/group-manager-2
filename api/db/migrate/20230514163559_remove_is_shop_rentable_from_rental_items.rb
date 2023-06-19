class RemoveIsShopRentableFromRentalItems < ActiveRecord::Migration[6.1]
  def change
    remove_column :rental_items, :is_shop_rentable, :boolean
  end
end
