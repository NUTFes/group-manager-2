# frozen_string_literal: true

require 'test_helper'
require 'csv'

# 物品貸出関連のCSV出力について、以下のAPI契約を固定する。
# - 存在しない開催年IDは404を返し、CSVをダウンロードさせない
# - 物品申請一覧CSV(get_rental_orders_csv)は申請(RentalOrder)が元データで、割当前の申請も出力される
# - 貸出物品リストCSV(get_rental_items_list_csv)は割当(AssignRentalItem)が元データで、在庫場所・貸出場所を出力する
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

  # 存在しない開催年ID -----------------------------------------------------

  test 'assign rental items csv returns 404 for unknown fes year id' do
    get "/api/v1/get_assign_rental_items_csv/#{unknown_fes_year_id}",
        headers: auth_headers(@user)

    assert_response :not_found
    assert_no_csv_downloaded
  end

  test 'rental orders csv returns 404 for unknown fes year id' do
    get "/api/v1/get_rental_orders_csv/#{unknown_fes_year_id}",
        headers: auth_headers(@user)

    assert_response :not_found
    assert_no_csv_downloaded
  end

  test 'rental items list csv returns 404 for unknown fes year id' do
    get "/api/v1/get_rental_items_list_csv/#{unknown_fes_year_id}",
        headers: auth_headers(@user)

    assert_response :not_found
    assert_no_csv_downloaded
  end

  # 物品申請一覧CSV（申請ベース） -------------------------------------------

  # 割当がまだ行われていない申請も出力対象に含まれること。
  # 物品申請一覧画面のCSVがこのエンドポイントを使っているため、この契約を変えてはいけない。
  test 'rental orders csv includes orders that have no assignment yet' do
    RentalOrder.create!(group: @group, rental_item: @rental_item, num: 3)

    get "/api/v1/get_rental_orders_csv/#{@fes_year.id}", headers: auth_headers(@user)

    assert_response :success
    rows = parse_csv(response.body)
    assert_equal %w[参加団体名 代表者 メールアドレス カテゴリー 物品名 数 開催年], rows.first
    assert_equal ['技大祭企画', @user.name, @user.email, '食品販売', '長机', '3', '2026'], rows.second
  end

  # 申請数量が出力されること（割当数量ではない）
  test 'rental orders csv outputs the ordered quantity not the assigned quantity' do
    RentalOrder.create!(group: @group, rental_item: @rental_item, num: 10)
    AssignRentalItem.create!(group: @group, rental_item: @rental_item, num: 4,
                             stocker_place: @stocker_place)

    get "/api/v1/get_rental_orders_csv/#{@fes_year.id}", headers: auth_headers(@user)

    assert_response :success
    rows = parse_csv(response.body)
    assert_equal 2, rows.size, '申請1件に対して1行だけ出力される'
    assert_equal '10', rows.second[5]
  end

  # 貸出物品リストCSV（割当ベース） -----------------------------------------

  test 'rental items list csv outputs stock place and rental place' do
    AssignRentalItem.create!(group: @group, rental_item: @rental_item, num: 2,
                             stocker_place: @stocker_place, rental_place: @rental_place)

    get "/api/v1/get_rental_items_list_csv/#{@fes_year.id}", headers: auth_headers(@user)

    assert_response :success
    rows = parse_csv(response.body)
    assert_equal %w[参加団体名 代表者 メールアドレス カテゴリー 物品名 在庫場所 貸出場所 数 開催年], rows.first
    assert_equal '体育館倉庫', rows.second[5]
    assert_equal '第1体育館前', rows.second[6]
  end

  # 貸出場所調整で未設定の場合は空欄にする
  test 'rental items list csv leaves rental place blank when it is not assigned' do
    AssignRentalItem.create!(group: @group, rental_item: @rental_item, num: 2,
                             stocker_place: @stocker_place, rental_place: nil)

    get "/api/v1/get_rental_items_list_csv/#{@fes_year.id}", headers: auth_headers(@user)

    assert_response :success
    rows = parse_csv(response.body)
    assert_equal '体育館倉庫', rows.second[5]
    assert_equal '', rows.second[6]
  end

  # 割当されていない申請は出力されない（申請ベースのCSVとの違い）
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

  def auth_headers(user)
    user.create_new_auth_token
  end

  # CSVの先頭にはExcel対策のBOMが付くため、取り除いてからパースする
  def parse_csv(body)
    CSV.parse(body.delete_prefix("\uFEFF"))
  end

  def assert_no_csv_downloaded
    assert_nil response.headers['Content-Disposition'],
               'CSVがダウンロードされないこと'
  end
end
