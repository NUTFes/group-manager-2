class CreateStageOrders < ActiveRecord::Migration[6.0]
  def change
    create_table :stage_orders do |t|
      t.integer :group_id
      t.boolean :is_sunny
      t.integer :fes_date_id
      t.integer :stage_first
      t.integer :stage_second
      t.string :use_time_interval
      t.string :prepare_time_interval
      t.string :cleanup_time_interval
      t.string :prepare_start_time
      t.string :performance_start_time
      t.string :performance_end_time
      t.string :cleanup_end_time

      t.timestamps
    end
  end
end
