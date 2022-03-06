class CreatePublicRelations < ActiveRecord::Migration[6.1]
  def change
    create_table :public_relations do |t|
      t.integer :group_id
      t.string :picture_name
      t.string :picture_path
      t.text :blurb

      t.timestamps
    end
  end
end
