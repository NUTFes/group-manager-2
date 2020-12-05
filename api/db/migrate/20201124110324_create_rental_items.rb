class CreateRentalItems < ActiveRecord::Migration[6.0]
  def change
    create_table :rental_items do |t|
      t.string :name
      t.boolean :is_rentable

      t.timestamps
    end
  end
end
