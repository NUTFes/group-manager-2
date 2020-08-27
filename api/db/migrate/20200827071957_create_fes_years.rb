class CreateFesYears < ActiveRecord::Migration[6.0]
  def change
    create_table :fes_years do |t|
      t.integer :year_num

      t.timestamps
    end
  end
end
