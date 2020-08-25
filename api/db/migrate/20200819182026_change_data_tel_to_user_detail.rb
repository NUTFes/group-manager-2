class ChangeDataTelToUserDetail < ActiveRecord::Migration[6.0]
  def change
    change_column :user_details, :tel, :string
  end
end
