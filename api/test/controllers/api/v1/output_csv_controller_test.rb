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

  test 'rental orders CSV aggregates duplicate group and item orders before adding remarks' do
    rows = download_csv("/api/v1/get_rental_orders_csv/#{groups(:one).fes_year_id}")
    headers = rows.first
    target_rows = rows.drop(1).select do |row|
      row[headers.index('参加団体名')] == groups(:one).name &&
        row[headers.index('物品名')] == rental_items(:one).name
    end

    assert_equal 1, target_rows.length
    assert_equal '2', target_rows.first[headers.index('数')]
    assert_equal '長岡高専A', target_rows.first[headers.index('備考')]
  end

  test 'rental orders CSV query count does not grow with duplicate rows' do
    base_query_count = count_select_queries do
      download_csv("/api/v1/get_rental_orders_csv/#{groups(:one).fes_year_id}")
    end

    5.times do |index|
      RentalOrder.create!(group: groups(:one), rental_item: rental_items(:one), num: 1)
      AssignRentalItem.create!(
        group: groups(:one),
        rental_item: rental_items(:one),
        stocker_place: stocker_places(:one),
        num: 1,
        remark: "追加備考#{index}"
      )
    end

    expanded_query_count = count_select_queries do
      download_csv("/api/v1/get_rental_orders_csv/#{groups(:one).fes_year_id}")
    end

    assert_operator expanded_query_count, :<=, base_query_count + 1
  end

  test 'assign rental items CSV includes its remark column' do
    rows = download_csv("/api/v1/get_assign_rental_items_csv/#{groups(:one).fes_year_id}")

    remark_index = rows.first.index('備考')
    assert remark_index
    assert(rows.drop(1).any? { |row| row[remark_index] == '長岡高専A' })
  end

  private

  def count_select_queries(&)
    query_count = 0
    callback = lambda do |_name, _started, _finished, _unique_id, payload|
      sql = payload[:sql]
      query_count += 1 if sql.start_with?('SELECT') && !payload[:cached]
    end
    ActiveSupport::Notifications.subscribed(callback, 'sql.active_record', &)
    query_count
  end

  def download_csv(path)
    get path, headers: @admin.create_new_auth_token

    assert_response :success
    CSV.parse(response.body.delete_prefix("\uFEFF"))
  end
end
