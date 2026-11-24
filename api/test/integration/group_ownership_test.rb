# frozen_string_literal: true

require 'test_helper'

# user（role_id 3）は自団体のデータだけを扱え、自団体の範囲に無いもの
# （他団体のレコード・存在しないID・他団体のgroup_id）はすべて403になることを確認する。
# staff（role_id 2）は全団体を参照でき、書き込みはできない。manager（role_id 1）は全団体に書き込める。
# 存在しないIDは、staff以上なら各controllerの既存のNot foundのまま。
class GroupOwnershipTest < ActionDispatch::IntegrationTest
  self.fixture_table_names = []

  setup do
    @manager = create_api_user(role_id: 1)
    @staff = create_api_user(role_id: 2)
    @user = create_api_user(role_id: 3)
    @other_user = create_api_user(role_id: 3)

    fes_year = FesYear.create!(year_num: 2026)
    @fes_date = FesDate.create!(fes_year: fes_year, days_num: 1, date: '2026-10-01', day: '木')
    group_category = GroupCategory.create!(name: '模擬店')
    @group = create_group!(@user, fes_year, group_category)
    @other_group = create_group!(@other_user, fes_year, group_category)

    @stage_order = create_stage_order!(@group)
    @other_stage_order = create_stage_order!(@other_group)
  end

  # --- scaffold形式のcontroller（stage_ordersで代表して確認する）

  test 'userは自団体のステージ申請を晴天・雨天ともに取得・更新できる' do
    rainy_stage_order = StageOrder.create!(stage_order_params(@group).merge(is_sunny: false))

    get "/stage_orders/group/#{@group.id}", headers: headers_for(@user), as: :json
    assert_response :success
    assert_equal [@stage_order.id, rainy_stage_order.id].sort, response.parsed_body['data'].pluck('id').sort

    patch stage_order_url(@stage_order), params: { is_sunny: false }, headers: headers_for(@user), as: :json
    assert_response :success
    assert_not @stage_order.reload.is_sunny
  end

  test 'userが他団体のレコードを更新・削除すると403' do
    patch stage_order_url(@other_stage_order), params: { is_sunny: false }, headers: headers_for(@user), as: :json
    assert_response :forbidden
    assert @other_stage_order.reload.is_sunny

    stool_test = StoolTest.create!(status: '未提出')
    other_employee = Employee.create!(group: @other_group, name: '他団体の従業員', student_id: 1, stool_test: stool_test)
    assert_no_difference('Employee.count') do
      delete employee_url(other_employee), headers: headers_for(@user), as: :json
    end
    assert_response :forbidden
  end

  test 'userが存在しないIDを指定しても他団体と同じ403になる' do
    patch stage_order_url(StageOrder.maximum(:id) + 1), params: { is_sunny: false }, headers: headers_for(@user), as: :json

    assert_response :forbidden
  end

  test '全件を返す一覧は管理画面向けで、staff以上には全団体分が返る' do
    get stage_orders_url, headers: headers_for(@user), as: :json
    assert_response :forbidden

    get stage_orders_url, headers: headers_for(@staff), as: :json
    assert_response :success
    ids = response.parsed_body['data'].pluck('id')
    assert_includes ids, @stage_order.id
    assert_includes ids, @other_stage_order.id
  end

  test 'userが他団体のgroup_idで取得・作成・付け替えすると403' do
    get "/stage_orders/group/#{@other_group.id}", headers: headers_for(@user), as: :json
    assert_response :forbidden

    assert_no_difference('StageOrder.count') do
      post stage_orders_url, params: stage_order_params(@other_group), headers: headers_for(@user), as: :json
    end
    assert_response :forbidden

    patch stage_order_url(@stage_order), params: { group_id: @other_group.id }, headers: headers_for(@user), as: :json
    assert_response :forbidden
    assert_equal @group.id, @stage_order.reload.group_id
  end

  test 'staff以上は他団体のレコードも参照でき、存在しないIDは既存のNot foundのまま' do
    get stage_order_url(@other_stage_order), headers: headers_for(@manager), as: :json
    assert_response :success
    assert_equal @other_stage_order.id, response.parsed_body.dig('data', 'id')

    get stage_order_url(StageOrder.maximum(:id) + 1), headers: headers_for(@manager), as: :json
    assert_response :success
    assert_equal 404, response.parsed_body.dig('status', 'code')
  end

  # --- staff（管理画面の閲覧専用）

  test 'staffは他団体のデータを参照できるが、userの画面から呼ばれる書き込みもできない' do
    get "/stage_orders/group/#{@other_group.id}", headers: headers_for(@staff), as: :json
    assert_response :success

    get stage_order_url(@other_stage_order), headers: headers_for(@staff), as: :json
    assert_response :success

    patch stage_order_url(@other_stage_order), params: { is_sunny: false }, headers: headers_for(@staff), as: :json
    assert_response :forbidden
    assert @other_stage_order.reload.is_sunny

    assert_no_difference('StageOrder.count') do
      post stage_orders_url, params: stage_order_params(@other_group), headers: headers_for(@staff), as: :json
    end
    assert_response :forbidden
  end

  test 'managerは他団体のデータも更新できる' do
    patch stage_order_url(@other_stage_order), params: { is_sunny: false }, headers: headers_for(@manager), as: :json

    assert_response :success
    assert_not @other_stage_order.reload.is_sunny
  end

  # --- groups（user_idで自分の団体を判定する）

  test 'userは他人の団体を参照・更新できず、他人のuser_idで団体を作れない' do
    get group_url(@other_group), headers: headers_for(@user), as: :json
    assert_response :forbidden

    patch group_url(@other_group), params: { name: '書き換え' }, headers: headers_for(@user), as: :json
    assert_response :forbidden

    assert_no_difference('Group.count') do
      post groups_url, params: { name: '新団体', user_id: @other_user.id }, headers: headers_for(@user), as: :json
    end
    assert_response :forbidden
  end

  test '団体の一覧はstaff以上、削除はmanagerのみ' do
    get groups_url, headers: headers_for(@user), as: :json
    assert_response :forbidden

    get groups_url, headers: headers_for(@staff), as: :json
    assert_response :success

    assert_no_difference('Group.count') do
      delete group_url(@other_group), headers: headers_for(@staff), as: :json
    end
    assert_response :forbidden
  end

  # --- upsert（既存IDで他団体のレコードを上書きできないこと）

  test 'userは他団体の従業員をupsertで上書きできない' do
    stool_test = StoolTest.create!(status: '未提出')
    other_employee = Employee.create!(group: @other_group, name: '他団体の従業員', student_id: 1, stool_test: stool_test)

    post '/employees/upsert',
         params: { employees: [{ id: other_employee.id, group_id: @group.id, name: '乗っ取り', student_id: 2, stool_test_id: stool_test.id }] },
         headers: headers_for(@user), as: :json

    assert_response :forbidden
    assert_equal @other_group.id, other_employee.reload.group_id
  end

  test 'userは他団体のgroup_idで従業員をupsertできない' do
    stool_test = StoolTest.create!(status: '未提出')

    assert_no_difference('Employee.count') do
      post '/employees/upsert',
           params: { employees: [{ group_id: @other_group.id, name: '他団体へ追加', student_id: 3, stool_test_id: stool_test.id }] },
           headers: headers_for(@user), as: :json
    end
    assert_response :forbidden
  end

  # --- purchase_lists（food_productを通して団体に紐づく）

  test 'userは他団体の販売品の購入品を取得・更新できない' do
    shop = Shop.create!(name: '店')
    other_food_product = FoodProduct.create!(group: @other_group, name: '他団体の販売品')
    other_purchase_list = PurchaseList.create!(food_product: other_food_product, shop: shop, fes_date: @fes_date, items: '食材')

    patch purchase_list_url(other_purchase_list), params: { items: '書き換え' }, headers: headers_for(@user), as: :json
    assert_response :forbidden
    assert_equal '食材', other_purchase_list.reload.items

    get '/purchase_lists/food_product', params: { food_product_ids: [other_food_product.id] }, headers: headers_for(@user)
    assert_response :forbidden
  end

  # --- 自団体に限定していたcontrollerでも、staff以上は全団体を参照できる

  test 'staff以上は他団体の保健所提出ステータスを取得でき、userは他団体を取得できない' do
    get health_center_submission_statuses_url, params: { group_id: @other_group.id }, headers: headers_for(@staff)
    assert_response :success

    get health_center_submission_statuses_url, params: { group_id: @other_group.id }, headers: headers_for(@user)
    assert_response :forbidden
  end

  test 'placesのgroup_id指定はuserを自団体に限定し、staff以上は全団体を参照できる' do
    nonexistent_group_id = Group.maximum(:id) + 1

    get places_url, params: { group_id: @group.id }, headers: headers_for(@user)
    assert_response :success

    get places_url, params: { group_id: @other_group.id }, headers: headers_for(@user)
    assert_response :forbidden

    get places_url, params: { group_id: nonexistent_group_id }, headers: headers_for(@user)
    assert_response :forbidden

    get places_url, params: { group_id: @other_group.id }, headers: headers_for(@staff)
    assert_response :success

    get places_url, params: { group_id: nonexistent_group_id }, headers: headers_for(@staff)
    assert_response :success
    assert_equal 404, response.parsed_body.dig('status', 'code')
  end

  private

  def headers_for(user)
    user.create_new_auth_token
  end

  def create_group!(user, fes_year, group_category)
    Group.create!(name: "#{user.name}の団体", project_name: '企画', activity: '活動',
                  user: user, group_category: group_category, fes_year: fes_year)
  end

  def stage_order_params(group)
    { group_id: group.id, is_sunny: true, fes_date_id: @fes_date.id }
  end

  def create_stage_order!(group)
    StageOrder.create!(stage_order_params(group))
  end
end
