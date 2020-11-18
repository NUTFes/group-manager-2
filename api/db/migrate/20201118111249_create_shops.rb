class CreateShops < ActiveRecord::Migration[6.0]
  def change
    create_table :shops do |t|
      t.string :name
      t.string :kana
      t.string :tel
      t.string :time_weekdays
      t.string :time_sat
      t.string :time_sun
      t.string :time_holidays

      t.timestamps
    end
  end
end
