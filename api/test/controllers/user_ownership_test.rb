# frozen_string_literal: true

require 'test_helper'

class UserOwnershipTest < ActionDispatch::IntegrationTest
  self.fixture_table_names = []

  setup do
    Role.create!(id: Role::USER_ID, name: 'user')
    @user = create_user!('user-ownership@example.com')
    @other_user = create_user!('other-user-ownership@example.com')
    fes_year = FesYear.create!(year_num: 2026)
    group_category = GroupCategory.create!(name: 'ownership test')
    @group = create_group!('Owned group', @user, fes_year, group_category)
    @other_group = create_group!('Other group', @other_user, fes_year, group_category)
    @announcement = Announcement.create!(group: @group, message: 'owned')
    @other_announcement = Announcement.create!(group: @other_group, message: 'other')
  end

  test 'user list is scoped to owned groups' do
    get '/announcements', headers: auth_headers(@user), as: :json

    assert_response :success
    ids = response.parsed_body.fetch('data').pluck('id')
    assert_includes ids, @announcement.id
    assert_not_includes ids, @other_announcement.id
  end

  test 'user cannot read update or destroy another groups record' do
    get "/announcements/#{@other_announcement.id}", headers: auth_headers(@user), as: :json
    assert_response :not_found

    patch "/announcements/#{@other_announcement.id}",
          params: { message: 'stolen' },
          headers: auth_headers(@user),
          as: :json
    assert_response :not_found

    delete "/announcements/#{@other_announcement.id}", headers: auth_headers(@user), as: :json
    assert_response :not_found
    assert_equal 'other', @other_announcement.reload.message
  end

  test 'user cannot create or move a record into another group' do
    assert_no_difference('Announcement.count') do
      post '/announcements',
           params: { group_id: @other_group.id, message: 'stolen' },
           headers: auth_headers(@user),
           as: :json
    end
    assert_response :not_found

    patch "/announcements/#{@announcement.id}",
          params: { group_id: @other_group.id },
          headers: auth_headers(@user),
          as: :json
    assert_response :not_found
    assert_equal @group.id, @announcement.reload.group_id
  end

  test 'user bulk upsert rejects another group and another groups record id' do
    other_food_product = FoodProduct.create!(group: @other_group, name: 'other food')

    post '/food_products/upsert',
         params: { food_products: [{ group_id: @other_group.id, name: 'stolen' }] },
         headers: auth_headers(@user),
         as: :json
    assert_response :not_found

    post '/food_products/upsert',
         params: {
           food_products: [{ id: other_food_product.id, group_id: @group.id, name: 'stolen' }]
         },
         headers: auth_headers(@user),
         as: :json
    assert_response :not_found
    assert_equal 'other food', other_food_product.reload.name
  end

  test 'legacy v1 user endpoint rejects another group' do
    get "/api/v1/get_food_products_by_group_id/#{@other_group.id}",
        headers: auth_headers(@user),
        as: :json

    assert_response :not_found
  end

  test 'user group endpoints reject another group' do
    paths = [
      "/check_all_registered/#{@other_group.id}",
      "/food_products/group/#{@other_group.id}",
      "/rental_orders/group/#{@other_group.id}",
      "/stage_orders/group/#{@other_group.id}",
      "/employees/group/#{@other_group.id}",
      "/sub_reps/group/#{@other_group.id}",
      "/power_orders/group/#{@other_group.id}",
      "/place_orders/group/#{@other_group.id}",
      "/stage_common_options/group/#{@other_group.id}",
      "/public_relations/group/#{@other_group.id}",
      "/venue_maps/group/#{@other_group.id}",
      "/cooking_process_orders/group/#{@other_group.id}",
      "/un_registered_groups/group?group_id=#{@other_group.id}&order_type=1",
      "/fire_equipment_orders/group/#{@other_group.id}",
      "/health_center_submission_statuses?group_id=#{@other_group.id}"
    ]

    paths.each do |path|
      get path, headers: auth_headers(@user), as: :json
      assert_response :not_found, "expected another group's resource to be hidden: GET #{path}"
    end
  end

  test 'user nested endpoint rejects another groups parent record' do
    other_food_product = FoodProduct.create!(group: @other_group, name: 'other food')

    get "/purchase_lists/food_product?food_product_ids[]=#{other_food_product.id}",
        headers: auth_headers(@user),
        as: :json

    assert_response :not_found
  end

  private

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

  def create_group!(name, user, fes_year, group_category)
    Group.create!(
      name: name,
      project_name: "#{name} project",
      activity: "#{name} activity",
      user: user,
      fes_year: fes_year,
      group_category: group_category
    )
  end

  def auth_headers(user)
    user.create_new_auth_token
  end
end
