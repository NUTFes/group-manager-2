class AddFesYearIdToUserPageSettings < ActiveRecord::Migration[6.0]
  def change
    add_column :user_page_settings, :fes_year_id, :integer
  end
end
