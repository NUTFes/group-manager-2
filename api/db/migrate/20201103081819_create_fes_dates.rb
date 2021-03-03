class CreateFesDates < ActiveRecord::Migration[6.0]
  def change
    create_table :fes_dates do |t|
      t.integer :days_num
      t.string :date
      t.string :day
      t.integer :fes_year_id

      t.timestamps
    end
  end
end
