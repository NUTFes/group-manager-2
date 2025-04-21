class CreateJwtDenylists < ActiveRecord::Migration[6.1]
  def change
    create_table :jwt_denylists do |t|
      t.string :jti
      t.datetime :exp

      t.timestamps
    end
  end
end
