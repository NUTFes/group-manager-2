# frozen_string_literal: true

class AddAuthorIdToComments < ActiveRecord::Migration[6.1]
  def change
    add_reference :comments,
                  :author,
                  null: false,
                  foreign_key: { to_table: :users },
                  comment: '投稿したユーザーの users.id を保存するカラム'
  end
end
