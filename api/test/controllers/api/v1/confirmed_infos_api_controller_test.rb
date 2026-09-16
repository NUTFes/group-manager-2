# frozen_string_literal: true

require 'test_helper'

# 認証なしで閲覧する確定情報APIについて、以下のAPI契約を固定する。
# - 認証なしで閲覧できる
# - group_idとsecretの両方が一致したときだけ返し、片方でも欠けたり違えば404
# - 認証なしで露出するため、groupは公開してよい項目だけを返す
# - 物品は (物品, 貸出場所) ごとにまとめ、並び順を固定する
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
    @other_stocker_place = StockerPlace.create!(name: '第2体育館倉庫')
    @rental_place = StockerPlace.create!(name: '第1体育館前')
    @other_rental_place = StockerPlace.create!(name: '第2体育館前')
    @venue = StockerPlace.create!(name: '講義棟101')
    @other_venue = StockerPlace.create!(name: '講義棟102')

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
    assert_equal '物品貸出企画', data.dig('group', 'project_name')

    assert_equal(
      [{ 'rental_item_name' => '長机', 'rental_place_name' => '第1体育館前',
         'stocks' => [{ 'stock_place_name' => '体育館倉庫', 'num' => 3, 'remark' => nil }] }],
      data['rental_items']
    )
  end

  # 備考は割り当て1件ごとに付くため、在庫場所ごとの行に対応する
  test 'returns the remark of each rental item assignment' do
    @group.assign_rental_items.sole.update!(remark: '脚の折れているものが含まれます')

    get confirmed_info_path(@group, @group.secret)

    assert_response :success
    assert_equal '脚の折れているものが含まれます',
                 find_rental_item('長机')['stocks'].sole['remark']
  end

  test 'returns null as the remark when it is not filled in' do
    get confirmed_info_path(@group, @group.secret)

    assert_response :success
    assert_nil find_rental_item('長机')['stocks'].sole['remark']
  end

  # remarkに空文字を禁じる制約が無いため、備考なしがnilと空文字の2通りになり得る。
  # CSV・PDFがpresent?で同一に扱っているのに合わせ、APIもnullに寄せる
  test 'returns null as the remark when it is stored as a blank string' do
    @group.assign_rental_items.sole.update!(remark: '')

    get confirmed_info_path(@group, @group.secret)

    assert_response :success
    assert_nil find_rental_item('長机')['stocks'].sole['remark']
  end

  # groupと同じく、認証なしで露出するstocksの公開範囲も明示的に固定する。
  # assign_rental_itemsに列が追加されても勝手に公開されないことを担保する
  test 'exposes only the intended attributes of a stock' do
    get confirmed_info_path(@group, @group.secret)

    assert_response :success
    assert_equal %w[num remark stock_place_name],
                 find_rental_item('長机')['stocks'].sole.keys.sort
  end

  # 会場は place_order -> assign_group_places -> stocker_place から引く。
  # has_many なので複数あり得る
  # 割り当て順ではなく名前順で返す。取得順まかせだと表示順が不定になるため、
  # 逆順で割り当てて並べ替えが効いていることを確かめる
  test 'returns the assigned places of the group sorted by name' do
    assign_places!(@group, [@other_venue, @venue])

    get confirmed_info_path(@group, @group.secret)

    assert_response :success
    assert_equal %w[講義棟101 講義棟102], response.parsed_body.dig('data', 'group', 'places')
  end

  test 'returns an empty array when no place is assigned' do
    get confirmed_info_path(@group, @group.secret)

    assert_response :success
    assert_equal [], response.parsed_body.dig('data', 'group', 'places')
  end

  # レビュー指摘への対応。物品が在庫場所ごとに1行なので、まとめないと
  # 「机・椅子・机」のように同じ物品が離れて並ぶ
  test 'groups the stocks of the same rental item together' do
    AssignRentalItem.create!(
      group: @group, rental_item: @rental_item, stocker_place: @other_stocker_place,
      rental_place: @rental_place, num: 5
    )
    AssignRentalItem.create!(
      group: @group, rental_item: @other_rental_item, stocker_place: @stocker_place,
      rental_place: @rental_place, num: 1
    )

    get confirmed_info_path(@group, @group.secret)

    assert_response :success
    items = response.parsed_body.dig('data', 'rental_items')
    assert_equal(%w[パイプ椅子 長机], items.pluck('rental_item_name'))

    desk = items.find { |item| item['rental_item_name'] == '長机' }
    assert_equal([['体育館倉庫', 3], ['第2体育館倉庫', 5]],
                 desk['stocks'].map { |stock| [stock['stock_place_name'], stock['num']] })
  end

  # 貸出場所は種類ごとに1つという運用だがDBでは保証されていない。
  # (物品, 貸出場所) でまとめるので、割れていても見出しの貸出場所は必ず1つに定まる
  test 'splits the same rental item when the rental place differs' do
    AssignRentalItem.create!(
      group: @group, rental_item: @rental_item, stocker_place: @other_stocker_place,
      rental_place: @other_rental_place, num: 5
    )

    get confirmed_info_path(@group, @group.secret)

    assert_response :success
    items = response.parsed_body.dig('data', 'rental_items')
    assert_equal 2, items.size
    assert_equal(%w[第1体育館前 第2体育館前], items.pluck('rental_place_name'))
    assert(items.all? { |item| item['rental_item_name'] == '長机' })
  end

  # 並び順はAPIで固定する。ORDER BY が無いとDB任せになり、表示順が不定になる
  test 'orders the rental items and stocks by name' do
    AssignRentalItem.create!(
      group: @group, rental_item: @other_rental_item, stocker_place: @other_stocker_place,
      rental_place: @rental_place, num: 2
    )
    AssignRentalItem.create!(
      group: @group, rental_item: @rental_item, stocker_place: @other_stocker_place,
      rental_place: @rental_place, num: 5
    )

    get confirmed_info_path(@group, @group.secret)

    assert_response :success
    items = response.parsed_body.dig('data', 'rental_items')
    assert_equal(%w[パイプ椅子 長机], items.pluck('rental_item_name'))
    assert_equal(%w[体育館倉庫 第2体育館倉庫],
                 items.last['stocks'].pluck('stock_place_name'))
  end

  # このAPIの主目的。認証ヘッダを一切付けずに取得できることを固定する。
  test 'returns the confirmed info without any authentication header' do
    get confirmed_info_path(@group, @group.secret)

    assert_response :success
    assert_not_nil response.parsed_body.dig('data', 'group', 'id')
  end

  # 認証なしで露出するため、groupの公開範囲を明示的に固定する。
  # groupsに列が追加されても勝手に公開されないことを担保する。
  # 画面構成の見直し（レビュー指摘）で project_name と places を意図的に追加した。
  # 増やすときは必ずこのテストも更新し、公開を広げた記録を残すこと。
  test 'exposes only the intended attributes of the group' do
    get confirmed_info_path(@group, @group.secret)

    assert_response :success
    assert_equal %w[id name places project_name], response.parsed_body.dig('data', 'group').keys.sort
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
    assert_equal '', find_rental_item('パイプ椅子')['rental_place_name']
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
    assert_nil find_rental_item('パイプ椅子')
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

  # GroupSecretには空文字を禁じる検証もDB制約も無い。万一空文字のレコードが残っても、
  # secretを指定しないリクエストが一致しないことを固定する。
  test 'returns 404 when the stored secret is a blank string' do
    @group.group_secret.update!(secret: '')

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

  # group_idはパスパラメータなので必ず文字列で届く。正の整数以外は検索する前に弾く。
  # 現状のRailsは範囲外の値でクエリを発行せず結果的に404になるが、その内部挙動に依存すると
  # 将来ActiveModel::RangeErrorが伝播して500になり得るため、常に404であることを固定する。
  test 'returns 404 when the group id is not a positive integer' do
    %w[abc 1abc 01 -1 0 1e10].each do |group_id|
      get "/api/v1/get_confirmed_info_for_user_view/#{group_id}?secret=#{@group.secret}"

      assert_response :not_found, "group_id=#{group_id} で404になっていない"
    end
  end

  test 'returns 404 when the group id exceeds the range of the id column' do
    %w[9223372036854775808 999999999999999999999999999999].each do |group_id|
      get "/api/v1/get_confirmed_info_for_user_view/#{group_id}?secret=#{@group.secret}"

      assert_response :not_found, "group_id=#{group_id} で404になっていない"
    end
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

  def find_rental_item(rental_item_name)
    response.parsed_body.dig('data', 'rental_items')
            .find { |item| item['rental_item_name'] == rental_item_name }
  end

  def assign_places!(group, stocker_places)
    place_order = PlaceOrder.create!(group: group)
    stocker_places.each do |stocker_place|
      AssignGroupPlace.create!(place_order: place_order, stocker_place: stocker_place)
    end
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
