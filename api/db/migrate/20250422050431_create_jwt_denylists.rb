class CreateJwtDenylists < ActiveRecord::Migration[6.1]
  def change
    create_table :jwt_denylists do |t|
      t.string   :jti, null: false     # ← null 禁止
      t.datetime :exp, null: false     # ← null 禁止

      t.timestamps
    end

    add_index :jwt_denylists, :jti, unique: true  # ← 一意インデックス
  end
end
