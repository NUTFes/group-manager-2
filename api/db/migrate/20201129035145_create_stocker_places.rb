class CreateStockerPlaces < ActiveRecord::Migration[6.0]
  def change
    create_table :stocker_places do |t|
      t.string :name

      t.timestamps
    end
  end
end
