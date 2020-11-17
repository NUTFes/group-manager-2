class CreateAssignStages < ActiveRecord::Migration[6.0]
  def change
    create_table :assign_stages do |t|
      t.integer :stage_order_id
      t.integer :stage_id
      t.string :time_point_start
      t.string :time_point_end

      t.timestamps
    end
  end
end
