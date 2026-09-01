# frozen_string_literal: true

require 'test_helper'
require 'csv'

# 物品貸出関連のCSV出力について、以下のAPI契約を固定する。
# - 存在しない開催年IDは404を返し、CSVをダウンロードさせない
# - 物品申請一覧CSVは申請を団体・物品単位に集約し、割当備考を出力する
# - 貸出物品リストCSVは割当が元データで、在庫場所・貸出場所・備考を出力する
class Api::V1::OutputCsvControllerTest < ActionDispatch::IntegrationTest
  self.fixture_table_names = []

  setup do
    Role.create!(id: 1, name: 'admin')
    @user = create_user!
    @fes_year = FesYear.create!(year_num: 2026)
    @group_category = GroupCategory.create!(name: '食品販売')
    @group = create_group!
    @rental_item = RentalItem.create!(name: '長机')
    @stocker_place = StockerPlace.create!(name: '体育館倉庫', name_en: 'Gymnasium Storage')
    @rental_place = StockerPlace.create!(name: '第1体育館前')
  end

  test 'assign rental items csv returns 404 for unknown fes year id' do
    get "/api/v1/get_assign_rental_items_csv/#{unknown_fes_year_id}", headers: auth_headers(@user)

    assert_response :not_found
    assert_no_csv_downloaded
  end

  test 'rental orders csv returns 404 for unknown fes year id' do
    get "/api/v1/get_rental_orders_csv/#{unknown_fes_year_id}", headers: auth_headers(@user)

    assert_response :not_found
    assert_no_csv_downloaded
  end

  test 'rental items list csv returns 404 for unknown fes year id' do
    get "/api/v1/get_rental_items_list_csv/#{unknown_fes_year_id}", headers: auth_headers(@user)

    assert_response :not_found
    assert_no_csv_downloaded
  end

  test 'groups csv includes assignment remarks with item names' do
    create_assignment!(remark: '長岡高専A')

    get "/api/v1/get_groups_csv/#{@fes_year.id}", headers: auth_headers(@user)

    assert_response :success
    rows = parse_csv(response.body)
    assert_includes rows.first, '物品割り当て備考'
    assert_equal '長机: 長岡高専A', rows.second[rows.first.index('物品割り当て備考')]
  end

  test 'assign rental items csv outputs stock place rental place and remark' do
    create_assignment!(remark: '長岡高専A')

    get "/api/v1/get_assign_rental_items_csv/#{@fes_year.id}", headers: auth_headers(@user)

    assert_response :success
    rows = parse_csv(response.body)
    assert_equal %w[識別番号 参加団体名 カテゴリー 活動場所 使用電力 貸出物品名 在庫場所 貸出場所 数量 備考], rows.first
    assert_equal '体育館倉庫', rows.second[6]
    assert_equal '第1体育館前', rows.second[7]
    assert_equal '長岡高専A', rows.second[9]
  end

  test 'rental orders csv includes orders that have no assignment yet' do
    RentalOrder.create!(group: @group, rental_item: @rental_item, num: 3)

    get "/api/v1/get_rental_orders_csv/#{@fes_year.id}", headers: auth_headers(@user)

    assert_response :success
    rows = parse_csv(response.body)
    assert_equal %w[参加団体名 代表者 メールアドレス カテゴリー 物品名 数 備考 開催年], rows.first
    assert_equal ['技大祭企画', @user.name, @user.email, '食品販売', '長机', '3', '', '2026'], rows.second
  end

  test 'rental orders csv aggregates duplicate orders and outputs assignment remarks' do
    RentalOrder.create!(group: @group, rental_item: @rental_item, num: 3)
    RentalOrder.create!(group: @group, rental_item: @rental_item, num: 2)
    create_assignment!(num: 4, remark: '長岡高専A')
    create_assignment!(num: 1, remark: 'テント2')

    get "/api/v1/get_rental_orders_csv/#{@fes_year.id}", headers: auth_headers(@user)

    assert_response :success
    rows = parse_csv(response.body)
    assert_equal 2, rows.size, '同じ団体・物品の申請は1行に集約される'
    assert_equal '5', rows.second[5]
    assert_equal "長岡高専A\nテント2", rows.second[6]
  end

  test 'rental orders csv query count does not grow with duplicate rows' do
    RentalOrder.create!(group: @group, rental_item: @rental_item, num: 1)
    create_assignment!(remark: '基準備考')
    base_query_count = count_select_queries do
      get "/api/v1/get_rental_orders_csv/#{@fes_year.id}", headers: auth_headers(@user)
    end

    5.times do |index|
      RentalOrder.create!(group: @group, rental_item: @rental_item, num: 1)
      create_assignment!(remark: "追加備考#{index}")
    end

    expanded_query_count = count_select_queries do
      get "/api/v1/get_rental_orders_csv/#{@fes_year.id}", headers: auth_headers(@user)
    end

    assert_operator expanded_query_count, :<=, base_query_count + 1
  end

  test 'rental items list csv outputs stock place rental place and remark' do
    create_assignment!(num: 2, remark: '長岡高専A')

    get "/api/v1/get_rental_items_list_csv/#{@fes_year.id}", headers: auth_headers(@user)

    assert_response :success
    rows = parse_csv(response.body)
    assert_equal %w[参加団体名 代表者 メールアドレス カテゴリー 物品名 在庫場所 貸出場所 数 備考 開催年], rows.first
    assert_equal '体育館倉庫', rows.second[5]
    assert_equal '第1体育館前', rows.second[6]
    assert_equal '長岡高専A', rows.second[8]
  end

  test 'rental items list csv leaves rental place blank when it is not assigned' do
    create_assignment!(num: 2, rental_place: nil)

    get "/api/v1/get_rental_items_list_csv/#{@fes_year.id}", headers: auth_headers(@user)

    assert_response :success
    rows = parse_csv(response.body)
    assert_equal '体育館倉庫', rows.second[5]
    assert_equal '', rows.second[6]
  end

  test 'rental items list csv excludes orders that have no assignment' do
    RentalOrder.create!(group: @group, rental_item: @rental_item, num: 3)

    get "/api/v1/get_rental_items_list_csv/#{@fes_year.id}", headers: auth_headers(@user)

    assert_response :success
    rows = parse_csv(response.body)
    assert_equal 1, rows.size, 'ヘッダー行のみが出力される'
  end

  private

  def unknown_fes_year_id
    FesYear.maximum(:id).to_i + 1000
  end

  def create_user!(email: 'output-csv-user@example.com')
    User.create!(
      name: email.split('@').first,
      email: email,
      uid: email,
      provider: 'email',
      password: 'password',
      password_confirmation: 'password',
      role_id: 1
    )
  end

  def create_group!(name: '技大祭企画')
    Group.create!(
      name: name,
      project_name: '物品貸出企画',
      activity: '食品販売',
      user: @user,
      group_category: @group_category,
      fes_year: @fes_year
    )
  end

  def create_assignment!(num: 1, remark: nil, rental_place: @rental_place)
    AssignRentalItem.create!(
      group: @group,
      rental_item: @rental_item,
      num: num,
      remark: remark,
      stocker_place: @stocker_place,
      rental_place: rental_place
    )
  end

  def auth_headers(user)
    user.create_new_auth_token
  end

  def parse_csv(body)
    CSV.parse(body.delete_prefix("\uFEFF"))
  end

  def assert_no_csv_downloaded
    assert_nil response.headers['Content-Disposition'], 'CSVがダウンロードされないこと'
  end

  def count_select_queries(&)
    query_count = 0
    callback = lambda do |_name, _started, _finished, _unique_id, payload|
      sql = payload[:sql]
      query_count += 1 if sql.start_with?('SELECT') && !payload[:cached]
    end
    ActiveSupport::Notifications.subscribed(callback, 'sql.active_record', &)
    query_count
  end
end
