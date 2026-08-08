# frozen_string_literal: true

require 'test_helper'

class UserOwnershipCrudMatrixTest < ActionDispatch::IntegrationTest
  self.fixture_table_names = []

  setup do
    Role.create!(id: Role::USER_ID, name: 'user')
    @user = create_user!('ownership-crud-user@example.com')
    @other_user = create_user!('ownership-crud-other@example.com')
    @fes_year = FesYear.create!(year_num: 2026)
    @group_category = GroupCategory.create!(name: 'ownership CRUD test')
    @group = create_group!('Owned CRUD group', @user)
    @other_group = create_group!('Other CRUD group', @other_user)
    @fes_date = FesDate.create!(fes_year_id: @fes_year.id, days_num: 1, date: '2026-09-12', day: 'Saturday')
    @shop = Shop.create!(name: 'Ownership shop')
    @rental_item = RentalItem.create!(name: 'Ownership rental item')
    @stool_test = StoolTest.create!(status: 'unsubmitted')
    @department = Department.create!(name: 'Ownership department')
    @grade = Grade.create!(name: 'Ownership grade')

    @owned_records = create_group_records!(@group, 'owned')
    @other_records = create_group_records!(@other_group, 'other')
    @crud_cases = ownership_crud_cases
  end

  test 'every group backed CRUD controller scopes index show update and destroy' do
    @crud_cases.each do |test_case|
      assert_index_contains_only_owned_record(test_case)
      assert_other_record_is_hidden_for_member_actions(test_case)
    end
  end

  test 'every group backed CRUD controller rejects create for another group' do
    @crud_cases.each do |test_case|
      before_count = test_case.fetch(:model).count

      post test_case.fetch(:path),
           params: test_case.fetch(:create_for_other),
           headers: auth_headers(@user),
           as: :json

      assert_response :not_found, "#{test_case.fetch(:name)} create should hide another group"
      assert_equal before_count, test_case.fetch(:model).count,
                   "#{test_case.fetch(:name)} must not create another group's record"
    end
  end

  test 'every group backed CRUD controller rejects moving an owned record to another group' do
    @crud_cases.each do |test_case|
      owned_record = test_case.fetch(:owned)
      original_owner_id = test_case.fetch(:owner_id).call(owned_record)

      patch "#{test_case.fetch(:path)}/#{owned_record.id}",
            params: test_case.fetch(:move_to_other),
            headers: auth_headers(@user),
            as: :json

      assert_response :not_found, "#{test_case.fetch(:name)} update should hide another group"
      assert_equal original_owner_id, test_case.fetch(:owner_id).call(owned_record.reload),
                   "#{test_case.fetch(:name)} must remain in its original group"
    end
  end

  test 'all group backed bulk upserts reject another group and another groups record id' do
    assert_bulk_request_rejected(
      '/employees/upsert',
      {
        employees: [{
          group_id: @other_group.id,
          name: 'stolen employee',
          student_id: 999,
          stool_test_id: @stool_test.id
        }]
      },
      Employee
    )
    assert_bulk_request_rejected(
      '/employees/upsert',
      {
        employees: [{
          id: @other_records.fetch(:employees).id,
          group_id: @group.id,
          name: 'stolen employee',
          student_id: 999,
          stool_test_id: @stool_test.id
        }]
      },
      Employee
    )
    assert_bulk_request_rejected(
      '/cooking_process_orders/upsert',
      {
        cooking_process_orders: [{
          food_product_id: @other_records.fetch(:food_products).id,
          tent: 'stolen cooking process'
        }]
      },
      CookingProcessOrder
    )
    assert_bulk_request_rejected(
      '/cooking_process_orders/upsert',
      {
        cooking_process_orders: [{
          id: @other_records.fetch(:cooking_process_orders).id,
          food_product_id: @owned_records.fetch(:food_products).id,
          tent: 'stolen cooking process'
        }]
      },
      CookingProcessOrder
    )
    assert_bulk_request_rejected(
      '/purchase_lists/upsert',
      {
        purchase_lists: [{
          food_product_id: @other_records.fetch(:food_products).id,
          shop_id: @shop.id,
          fes_date_id: @fes_date.id,
          items: 'stolen purchase'
        }]
      },
      PurchaseList
    )
    assert_bulk_request_rejected(
      '/purchase_lists/upsert',
      {
        purchase_lists: [{
          id: @other_records.fetch(:purchase_lists).id,
          food_product_id: @owned_records.fetch(:food_products).id,
          shop_id: @shop.id,
          fes_date_id: @fes_date.id,
          items: 'stolen purchase'
        }]
      },
      PurchaseList
    )
  end

  test 'power and fire equipment submit endpoints reject another group and its record ids' do
    assert_submit_rejected(
      '/power_orders/submit',
      {
        group_id: @other_group.id,
        use_power: true,
        power_orders: [{ item: 'stolen power', power: 100 }]
      },
      @other_records.fetch(:power_orders)
    )
    assert_submit_rejected(
      '/power_orders/submit',
      {
        group_id: @group.id,
        use_power: true,
        power_orders: [{
          id: @other_records.fetch(:power_orders).id,
          item: 'stolen power',
          power: 100
        }]
      },
      @other_records.fetch(:power_orders)
    )
    assert_submit_rejected(
      '/fire_equipment_orders/submit',
      {
        group_id: @other_group.id,
        fire_equipment_orders: [{
          name: 'stolen fire equipment',
          quantity: 1,
          fuel: 'gas_bottle'
        }]
      },
      @other_records.fetch(:fire_equipment_orders)
    )
    assert_submit_rejected(
      '/fire_equipment_orders/submit',
      {
        group_id: @group.id,
        fire_equipment_orders: [{
          id: @other_records.fetch(:fire_equipment_orders).id,
          name: 'stolen fire equipment',
          quantity: 1,
          fuel: 'gas_bottle'
        }]
      },
      @other_records.fetch(:fire_equipment_orders)
    )
  end

  test 'power and fire equipment index and show are scoped to owned groups' do
    assert_index_scope('/power_orders', @owned_records.fetch(:power_orders), @other_records.fetch(:power_orders))
    assert_index_scope(
      '/fire_equipment_orders',
      @owned_records.fetch(:fire_equipment_orders),
      @other_records.fetch(:fire_equipment_orders)
    )

    get "/power_orders/#{@other_records.fetch(:power_orders).id}",
        headers: auth_headers(@user),
        as: :json
    assert_response :not_found

    get "/fire_equipment_orders/#{@other_records.fetch(:fire_equipment_orders).id}",
        headers: auth_headers(@user),
        as: :json
    assert_response :not_found
  end

  test 'group endpoints expose and update only the current users groups' do
    get "/groups/#{@other_group.id}", headers: auth_headers(@user), as: :json
    assert_response :not_found

    patch "/groups/#{@other_group.id}",
          params: { name: 'stolen group' },
          headers: auth_headers(@user),
          as: :json
    assert_response :not_found
    assert_equal 'Other CRUD group', @other_group.reload.name

    get "/groups/user/#{@other_user.id}", headers: auth_headers(@user), as: :json
    assert_response :not_found

    post '/groups',
         params: {
           name: 'Created by current user',
           project_name: 'Ownership project',
           activity: 'Ownership activity',
           user_id: @other_user.id,
           fes_year_id: @fes_year.id,
           group_category_id: @group_category.id
         },
         headers: auth_headers(@user).merge('X-Skip-Slack-Notification' => 'true'),
         as: :json
    assert_response :success
    assert_equal @user.id, Group.order(:id).last.user_id
  end

  test 'health center submission statuses are scoped for index create and update' do
    other_status = HealthCenterSubmissionStatus.find_by!(group: @other_group, application_type: :food_product)

    get "/health_center_submission_statuses?group_id=#{@other_group.id}",
        headers: auth_headers(@user),
        as: :json
    assert_response :not_found

    post '/health_center_submission_statuses',
         params: {
           group_id: @other_group.id,
           application_type: 'power_order',
           status: 'unapproved'
         },
         headers: auth_headers(@user),
         as: :json
    assert_response :not_found

    patch "/health_center_submission_statuses/#{other_status.id}",
          params: { status: 'unapproved' },
          headers: auth_headers(@user),
          as: :json
    assert_response :not_found
  end

  test 'user detail and current user endpoints never expose another user' do
    other_detail = UserDetail.create!(
      user: @other_user,
      tel: '0000000000',
      department_id: @department.id,
      grade_id: @grade.id,
      student_id: 12_345_678
    )

    get "/user_details?user_id=#{@other_user.id}", headers: auth_headers(@user), as: :json
    assert_response :not_found

    get "/user_details/#{other_detail.id}", headers: auth_headers(@user), as: :json
    assert_response :not_found

    patch "/user_details/#{other_detail.id}",
          params: { tel: 'stolen' },
          headers: auth_headers(@user),
          as: :json
    assert_response :not_found
    assert_equal '0000000000', other_detail.reload.tel

    delete "/user_details/#{other_detail.id}", headers: auth_headers(@user), as: :json
    assert_response :not_found
    assert UserDetail.exists?(other_detail.id)

    post '/user_details',
         params: {
           user_id: @other_user.id,
           tel: '1111111111',
           department_id: @department.id,
           grade_id: @grade.id,
           student_id: 87_654_321
         },
         headers: auth_headers(@user),
         as: :json
    assert_response :success
    assert_equal @user.id, UserDetail.find_by!(tel: '1111111111').user_id

    get '/current_user', headers: auth_headers(@user), as: :json
    assert_response :success
    assert_equal @user.id, response.parsed_body.fetch('id')

    get '/api/v1/users/show', headers: auth_headers(@user), as: :json
    assert_response :success
    assert_equal @user.id, response.parsed_body.dig('data', 'id')
  end

  private

  def ownership_crud_cases
    direct_group_owner = ->(record) { record.group_id }
    food_product_owner = ->(record) { record.food_product.group_id }

    [
      ownership_case(
        :announcements,
        '/announcements',
        Announcement,
        { group_id: @other_group.id, message: 'stolen announcement' },
        { group_id: @other_group.id },
        direct_group_owner
      ),
      ownership_case(
        :contact_persons,
        '/contact_persons',
        ContactPerson,
        { contact_person: { group_id: @other_group.id, name: 'stolen contact' } },
        { contact_person: { group_id: @other_group.id } },
        direct_group_owner
      ),
      ownership_case(
        :cooking_process_orders,
        '/cooking_process_orders',
        CookingProcessOrder,
        {
          cooking_process_order: {
            food_product_id: @other_records.fetch(:food_products).id,
            tent: 'stolen cooking process'
          }
        },
        {
          cooking_process_order: {
            food_product_id: @other_records.fetch(:food_products).id
          }
        },
        direct_group_owner
      ),
      ownership_case(
        :employees,
        '/employees',
        Employee,
        {
          group_id: @other_group.id,
          name: 'stolen employee',
          student_id: 999,
          stool_test_id: @stool_test.id
        },
        { group_id: @other_group.id },
        direct_group_owner
      ),
      ownership_case(
        :food_products,
        '/food_products',
        FoodProduct,
        { group_id: @other_group.id, name: 'stolen food product' },
        { group_id: @other_group.id },
        direct_group_owner
      ),
      ownership_case(
        :place_orders,
        '/place_orders',
        PlaceOrder,
        { group_id: @other_group.id, remark: 'stolen place order' },
        { group_id: @other_group.id },
        direct_group_owner
      ),
      ownership_case(
        :public_relations,
        '/public_relations',
        PublicRelation,
        { group_id: @other_group.id, blurb: 'stolen public relation' },
        { group_id: @other_group.id },
        direct_group_owner
      ),
      ownership_case(
        :purchase_lists,
        '/purchase_lists',
        PurchaseList,
        {
          food_product_id: @other_records.fetch(:food_products).id,
          shop_id: @shop.id,
          fes_date_id: @fes_date.id,
          items: 'stolen purchase'
        },
        { food_product_id: @other_records.fetch(:food_products).id },
        food_product_owner
      ),
      ownership_case(
        :rental_orders,
        '/rental_orders',
        RentalOrder,
        {
          group_id: @other_group.id,
          rental_item_id: @rental_item.id,
          num: 1
        },
        { group_id: @other_group.id },
        direct_group_owner
      ),
      ownership_case(
        :stage_common_options,
        '/stage_common_options',
        StageCommonOption,
        { group_id: @other_group.id, own_equipment: true },
        { group_id: @other_group.id },
        direct_group_owner
      ),
      ownership_case(
        :stage_orders,
        '/stage_orders',
        StageOrder,
        {
          group_id: @other_group.id,
          fes_date_id: @fes_date.id,
          is_sunny: true
        },
        { group_id: @other_group.id },
        direct_group_owner
      ),
      ownership_case(
        :sub_reps,
        '/sub_reps',
        SubRep,
        {
          group_id: @other_group.id,
          name: 'stolen sub rep',
          department_id: @department.id,
          grade_id: @grade.id
        },
        { group_id: @other_group.id },
        direct_group_owner
      ),
      ownership_case(
        :un_registered_groups,
        '/un_registered_groups',
        UnRegisteredGroup,
        {
          un_registered_group: {
            group_id: @other_group.id,
            order_type: 'power_order'
          }
        },
        {
          un_registered_group: {
            group_id: @other_group.id
          }
        },
        direct_group_owner
      ),
      ownership_case(
        :venue_maps,
        '/venue_maps',
        VenueMap,
        { group_id: @other_group.id, picture_name: 'stolen venue map' },
        { group_id: @other_group.id },
        direct_group_owner
      )
    ]
  end

  def ownership_case(name, path, model, create_for_other, move_to_other, owner_id)
    {
      name: name,
      path: path,
      model: model,
      owned: @owned_records.fetch(name),
      other: @other_records.fetch(name),
      create_for_other: create_for_other,
      move_to_other: move_to_other,
      owner_id: owner_id
    }
  end

  def create_group_records!(group, prefix)
    food_product = FoodProduct.create!(group: group, name: "#{prefix} food")

    {
      announcements: Announcement.create!(group: group, message: "#{prefix} announcement"),
      contact_persons: ContactPerson.create!(group_id: group.id, name: "#{prefix} contact"),
      cooking_process_orders: CookingProcessOrder.create!(
        group: group,
        food_product: food_product,
        tent: "#{prefix} cooking"
      ),
      employees: Employee.create!(
        group: group,
        stool_test: @stool_test,
        name: "#{prefix} employee",
        student_id: group.id
      ),
      food_products: food_product,
      place_orders: PlaceOrder.create!(group: group, remark: "#{prefix} place"),
      power_orders: PowerOrder.create!(group: group, item: "#{prefix} power", power: 100),
      public_relations: PublicRelation.create!(group: group, blurb: "#{prefix} public relation"),
      purchase_lists: PurchaseList.create!(
        food_product: food_product,
        shop: @shop,
        fes_date: @fes_date,
        items: "#{prefix} purchase"
      ),
      rental_orders: RentalOrder.create!(group: group, rental_item: @rental_item, num: 1),
      stage_common_options: StageCommonOption.create!(group: group, own_equipment: true),
      stage_orders: StageOrder.create!(group: group, fes_date: @fes_date, is_sunny: true),
      sub_reps: SubRep.create!(
        group: group,
        name: "#{prefix} sub rep",
        department: @department,
        grade: @grade
      ),
      un_registered_groups: UnRegisteredGroup.create!(group: group, order_type: :sub_rep),
      venue_maps: VenueMap.create!(group: group, picture_name: "#{prefix} venue map"),
      fire_equipment_orders: FireEquipmentOrder.create!(
        group: group,
        name: "#{prefix} fire equipment",
        quantity: 1,
        fuel: :gas_bottle
      )
    }
  end

  def assert_index_contains_only_owned_record(test_case)
    get test_case.fetch(:path), headers: auth_headers(@user), as: :json

    assert_response :success, "#{test_case.fetch(:name)} index should succeed"
    ids = response_record_ids
    assert_includes ids, test_case.fetch(:owned).id,
                    "#{test_case.fetch(:name)} index should include the owned record"
    assert_not_includes ids, test_case.fetch(:other).id,
                        "#{test_case.fetch(:name)} index must exclude another group's record"
  end

  def assert_other_record_is_hidden_for_member_actions(test_case)
    other_record = test_case.fetch(:other)

    get "#{test_case.fetch(:path)}/#{other_record.id}",
        headers: auth_headers(@user),
        as: :json
    assert_response :not_found, "#{test_case.fetch(:name)} show should hide another group"

    patch "#{test_case.fetch(:path)}/#{other_record.id}",
          params: test_case.fetch(:move_to_other),
          headers: auth_headers(@user),
          as: :json
    assert_response :not_found, "#{test_case.fetch(:name)} update should hide another group"

    delete "#{test_case.fetch(:path)}/#{other_record.id}",
           headers: auth_headers(@user),
           as: :json
    assert_response :not_found, "#{test_case.fetch(:name)} destroy should hide another group"
    assert test_case.fetch(:model).exists?(other_record.id),
           "#{test_case.fetch(:name)} must not destroy another group's record"
  end

  def assert_bulk_request_rejected(path, params, model)
    before_count = model.count

    post path, params: params, headers: auth_headers(@user), as: :json

    assert_response :not_found, "#{path} should hide another group's bulk record"
    assert_equal before_count, model.count, "#{path} must not create another group's bulk record"
  end

  def assert_submit_rejected(path, params, protected_record)
    original_attributes = protected_record.attributes

    put path, params: params, headers: auth_headers(@user), as: :json

    assert_response :not_found, "#{path} should hide another group or record"
    assert_equal original_attributes, protected_record.reload.attributes,
                 "#{path} must not change another group's record"
  end

  def assert_index_scope(path, owned_record, other_record)
    get path, headers: auth_headers(@user), as: :json

    assert_response :success
    ids = response_record_ids
    assert_includes ids, owned_record.id
    assert_not_includes ids, other_record.id
  end

  def response_record_ids
    body = response.parsed_body
    records = body.is_a?(Hash) && body.key?('data') ? body.fetch('data') : body
    Array(records).filter_map { |record| record['id'] if record.is_a?(Hash) }
  end

  def create_user!(email)
    User.create!(
      name: email.split('@').first,
      email: email,
      uid: email,
      provider: 'email',
      password: 'password',
      password_confirmation: 'password',
      role_id: Role::USER_ID
    )
  end

  def create_group!(name, user)
    Group.create!(
      name: name,
      project_name: "#{name} project",
      activity: "#{name} activity",
      user: user,
      fes_year: @fes_year,
      group_category: @group_category
    )
  end

  def auth_headers(user)
    user.create_new_auth_token
  end
end
