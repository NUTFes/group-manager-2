# frozen_string_literal: true

require 'test_helper'
require 'csv'

class Api::V1::OutputCsvControllerTest < ActionDispatch::IntegrationTest
  self.fixture_table_names = %w[
    group_categories fes_years groups rental_items stocker_places
    assign_rental_items rental_orders
  ]

  setup do
    FesYear.find_or_create_by!(id: 1) { |fes_year| fes_year.year_num = 2026 }
    GroupCategory.find_or_create_by!(id: 1) { |category| category.name = '食品販売' }
    Role.find_or_create_by!(id: 1, name: 'admin')
    @admin = User.find_or_initialize_by(id: 1)
    @admin.assign_attributes(
      name: '帳票テスト管理者',
      email: 'output-csv@example.com',
      provider: 'email',
      uid: 'output-csv@example.com',
      password: 'password',
      password_confirmation: 'password',
      role_id: 1
    )
    @admin.save!
  end

  test 'groups CSV includes assignment remarks' do
    rows = download_csv("/api/v1/get_groups_csv/#{groups(:one).fes_year_id}")

    remark_index = rows.first.index('物品割り当て備考')
    assert remark_index
    assert(rows.drop(1).any? { |row| row[remark_index]&.include?('長岡高専A') })
  end

  test 'rental orders CSV includes remarks for each group and item assignment' do
    rows = download_csv("/api/v1/get_rental_orders_csv/#{groups(:one).fes_year_id}")

    remark_index = rows.first.index('備考')
    assert remark_index
    assert(rows.drop(1).any? { |row| row[remark_index] == '長岡高専A' })
  end

  test 'assign rental items CSV includes its remark column' do
    rows = download_csv("/api/v1/get_assign_rental_items_csv/#{groups(:one).fes_year_id}")

    remark_index = rows.first.index('備考')
    assert remark_index
    assert(rows.drop(1).any? { |row| row[remark_index] == '長岡高専A' })
  end

  private

  def download_csv(path)
    get path, headers: @admin.create_new_auth_token

    assert_response :success
    CSV.parse(response.body.delete_prefix("\uFEFF"))
  end
end
