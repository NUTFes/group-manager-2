# frozen_string_literal: true

require 'test_helper'

# user（role_id 3）は自団体のデータだけを扱え、自団体の範囲に無いもの
# （他団体のレコード・存在しないID・他団体のgroup_id）はすべて403になることを確認する。
# admin（role_id 1, 2）は全団体を扱え、存在しないIDは各controllerの既存のNot foundのまま。
class GroupOwnershipTest < ActionDispatch::IntegrationTest
  self.fixture_table_names = []

  setup do
    @admin = create_api_user(role_id: 1)
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

  test 'userは自団体のレコードを参照できる' do
    get stage_order_url(@stage_order), headers: headers_for(@user), as: :json

    assert_response :success
    assert_equal @stage_order.id, response.parsed_body.dig('data', 'id')
  end

  test 'userが他団体のレコードを参照・更新・削除すると403' do
    get stage_order_url(@other_stage_order), headers: headers_for(@user), as: :json
    assert_response :forbidden

    patch stage_order_url(@other_stage_order), params: { is_sunny: false }, headers: headers_for(@user), as: :json
    assert_response :forbidden

    assert_no_difference('StageOrder.count') do
      delete stage_order_url(@other_stage_order), headers: headers_for(@user), as: :json
    end
    assert_response :forbidden
  end

  test 'userが存在しないIDを指定しても他団体と同じ403になる' do
    get stage_order_url(StageOrder.maximum(:id) + 1), headers: headers_for(@user), as: :json

    assert_response :forbidden
  end

  test 'userの一覧には自団体のレコードだけが含まれる' do
    get stage_orders_url, headers: headers_for(@user), as: :json

    assert_response :success
    assert_equal [@stage_order.id], response.parsed_body['data'].pluck('id')
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

  test 'adminは他団体のレコードも参照でき、存在しないIDは既存のNot foundのまま' do
    get stage_order_url(@other_stage_order), headers: headers_for(@admin), as: :json
    assert_response :success
    assert_equal @other_stage_order.id, response.parsed_body.dig('data', 'id')

    get stage_order_url(StageOrder.maximum(:id) + 1), headers: headers_for(@admin), as: :json
    assert_response :success
    assert_equal 404, response.parsed_body.dig('status', 'code')
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

  test '団体の一覧と削除はadmin以上' do
    get groups_url, headers: headers_for(@user), as: :json
    assert_response :forbidden

    get groups_url, headers: headers_for(@admin), as: :json
    assert_response :success
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

  test 'userは他団体の販売品の購入品を参照できない' do
    shop = Shop.create!(name: '店')
    other_food_product = FoodProduct.create!(group: @other_group, name: '他団体の販売品')
    other_purchase_list = PurchaseList.create!(food_product: other_food_product, shop: shop, fes_date: @fes_date, items: '食材')

    get purchase_list_url(other_purchase_list), headers: headers_for(@user), as: :json
    assert_response :forbidden

    get '/purchase_lists/food_product', params: { food_product_ids: [other_food_product.id] }, headers: headers_for(@user)
    assert_response :forbidden
  end

  # --- user_details（user_idで自分のものだけ）

  test 'userは他人のuser_idでユーザー詳細を参照できない' do
    get user_details_url, params: { user_id: @other_user.id }, headers: headers_for(@user)

    assert_response :forbidden
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
