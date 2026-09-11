class CreateComments < ActiveRecord::Migration[6.1]
  def change
    create_table :comments do |t|
      t.string :commentable_type, null: false
      t.bigint :commentable_id, null: false
      t.text :body, null: false

      t.timestamps
    end

    add_index :comments, %i[commentable_type commentable_id], name: 'index_comments_on_commentable'
  end
end
