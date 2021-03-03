class CreateStageCommonOptions < ActiveRecord::Migration[6.0]
  def change
    create_table :stage_common_options do |t|
      t.integer :group_id
      t.boolean :own_equipment
      t.boolean :bgm
      t.boolean :camera_permission
      t.boolean :loud_sound
      t.text :stage_content

      t.timestamps
    end
  end
end
