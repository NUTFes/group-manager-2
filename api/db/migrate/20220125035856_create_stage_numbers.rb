class CreateStageNumbers < ActiveRecord::Migration[6.1]
  def change
    create_table :stage_numbers do |t|
      t.integer :stage_id
      t.integer :group_identification_id

      t.timestamps
    end
  end
end
