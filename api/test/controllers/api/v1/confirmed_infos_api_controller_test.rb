# frozen_string_literal: true

require 'test_helper'

# 認証なしで閲覧する確定情報APIについて、以下のAPI契約を固定する。
# - 認証なしで閲覧できる
# - group_idとsecretの両方が一致したときだけ返し、片方でも欠けたり違えば404
# - 認証なしで露出するため、groupはidとnameだけを返す
class Api::V1::ConfirmedInfosApiControllerTest < ActionDispatch::IntegrationTest
  self.fixture_table_names = []

  setup do
    Role.create!(id: 1, name: 'admin')
    @group_category = GroupCategory.create!(name: '食品販売')
    @fes_year = FesYear.create!(year_num: 2026)

    @group = create_group!(name: '技大祭企画', email: 'confirmed-info-user@example.com')
    @other_group = create_group!(name: '別団体', email: 'confirmed-info-other@example.com')

    @rental_item = RentalItem.create!(name: '長机')
    @other_rental_item = RentalItem.create!(name: 'パイプ椅子')
    @stocker_place = StockerPlace.create!(name: '体育館倉庫', name_en: 'Gymnasium Storage')
    @rental_place = StockerPlace.create!(name: '第1体育館前')

    AssignRentalItem.create!(
      group: @group,
      rental_item: @rental_item,
      stocker_place: @stocker_place,
      rental_place: @rental_place,
      num: 3
    )
  end

  # 正常系 -----------------------------------------------------------------

  test 'returns the confirmed info when the group id and secret both match' do
    get confirmed_info_path(@group, @group.secret)

    assert_response :success
    data = response.parsed_body['data']
    assert_equal @group.id, data.dig('group', 'id')
    assert_equal '技大祭企画', data.dig('group', 'name')

    assert_equal(
      [{ 'rental_item_name' => '長机', 'stock_place_name' => '体育館倉庫',
         'rental_place_name' => '第1体育館前', 'num' => 3 }],
      data['assign_rental_items']
    )
  end

  # このAPIの主目的。認証ヘッダを一切付けずに取得できることを固定する。
  test 'returns the confirmed info without any authentication header' do
    get confirmed_info_path(@group, @group.secret)

    assert_response :success
    assert_not_nil response.parsed_body.dig('data', 'group', 'id')
  end

  # 認証なしで露出するため、groupの公開範囲をidとnameに固定する。
  # groupsに列が追加されても勝手に公開されないことを担保する。
  test 'exposes only the id and name of the group' do
    get confirmed_info_path(@group, @group.secret)

    assert_response :success
    assert_equal %w[id name], response.parsed_body.dig('data', 'group').keys.sort
  end

  # 貸出場所調整で未設定の物品は空文字を返す（AssignRentalItem#rental_place_name の仕様）
  test 'returns an empty rental place name when the rental place is not assigned' do
    AssignRentalItem.create!(
      group: @group,
      rental_item: @other_rental_item,
      stocker_place: @stocker_place,
      num: 1
    )

    get confirmed_info_path(@group, @group.secret)

    assert_response :success
    assigned = find_assign_rental_item('パイプ椅子')
    assert_equal '', assigned['rental_place_name']
  end

  test 'does not include the rental items of other groups' do
    AssignRentalItem.create!(
      group: @other_group,
      rental_item: @other_rental_item,
      stocker_place: @stocker_place,
      num: 5
    )

    get confirmed_info_path(@group, @group.secret)

    assert_response :success
    assert_nil find_assign_rental_item('パイプ椅子')
  end

  # 異常系 -----------------------------------------------------------------
  # idの存在有無を漏らさないため、いずれも404に統一する。

  test 'returns 404 when the secret is missing' do
    get "/api/v1/get_confirmed_info_for_user_view/#{@group.id}"

    assert_response :not_found
  end

  test 'returns 404 when the secret is blank' do
    get confirmed_info_path(@group, '')

    assert_response :not_found
  end

  test 'returns 404 when the secret does not match' do
    get confirmed_info_path(@group, 'wrongsecretwrongsecret01')

    assert_response :not_found
  end

  test 'returns 404 when the secret belongs to another group' do
    get confirmed_info_path(@group, @other_group.secret)

    assert_response :not_found
  end

  test 'returns 404 when the group id does not exist' do
    get "/api/v1/get_confirmed_info_for_user_view/#{Group.maximum(:id).to_i + 1000}?secret=#{@group.secret}"

    assert_response :not_found
  end

  # secretは単一の文字列しか受け付けない。
  # 配列で渡せると1リクエストで多数の候補を試せてしまい、ハッシュで渡すとクエリ生成時に例外になる。
  test 'returns 404 when the secret is given as an array' do
    get confirmed_info_url(@group), params: { secret: %w[a b] }

    assert_response :not_found
  end

  test 'returns 404 when the correct secret is hidden in an array' do
    get confirmed_info_url(@group), params: { secret: ['x', @group.secret] }

    assert_response :not_found
  end

  test 'returns 404 when the secret is given as a hash' do
    get confirmed_info_url(@group), params: { secret: { x: 'a' } }

    assert_response :not_found
  end

  # group_secrets.secret は utf8mb4_bin なので大文字小文字を区別する。
  # 照合順序が既定に戻ると探索空間が縮むため、API層でも固定しておく。
  test 'returns 404 when the secret differs only in letter case' do
    @group.group_secret.update!(secret: 'AbCdEfGhIjKlMnOpQrStUvWx')

    get confirmed_info_path(@group, 'abcdefghijklmnopqrstuvwx')

    assert_response :not_found
  end

  private

  def confirmed_info_url(group)
    "/api/v1/get_confirmed_info_for_user_view/#{group.id}"
  end

  def confirmed_info_path(group, secret)
    "#{confirmed_info_url(group)}?secret=#{CGI.escape(secret.to_s)}"
  end

  def find_assign_rental_item(rental_item_name)
    response.parsed_body.dig('data', 'assign_rental_items')
            .find { |item| item['rental_item_name'] == rental_item_name }
  end

  def create_group!(name:, email:)
    user = User.create!(
      name: email.split('@').first,
      email: email,
      uid: email,
      provider: 'email',
      password: 'password',
      password_confirmation: 'password',
      role_id: 1
    )

    Group.create!(
      name: name,
      project_name: '物品貸出企画',
      activity: '食品販売',
      user: user,
      group_category: @group_category,
      fes_year: @fes_year
    )
  end
end
