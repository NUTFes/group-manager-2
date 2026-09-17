class AddPlaceCategoryToStockerPlaces < ActiveRecord::Migration[6.1]
  def change
    add_reference :stocker_places, :place_category, null: true, foreign_key: true
  end
end
