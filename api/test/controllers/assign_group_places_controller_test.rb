# frozen_string_literal: true

require 'test_helper'

class AssignGroupPlacesControllerTest < ActionDispatch::IntegrationTest
  setup do
    @assign_group_place = assign_group_places(:one)

    Role.find_or_create_by!(id: 1) { |role| role.name = 'admin' }
    Role.find_or_create_by!(id: 3) { |role| role.name = 'user' }
    @admin = create_user!(email: 'admin-assign-group-place@example.com', role_id: 1)
    @restricted_user = create_user!(email: 'restricted-assign-group-place@example.com', role_id: 3)
    @headers = auth_headers(@admin)
  end

  test 'should get index' do
    get assign_group_places_url, headers: @headers, as: :json
    assert_response :success
  end

  test 'should create assign_group_place' do
    assert_difference('AssignGroupPlace.count') do
      post assign_group_places_url,
           params: { assign_group_place: { stocker_place_id: @assign_group_place.stocker_place_id, place_order_id: @assign_group_place.place_order_id } },
           headers: @headers, as: :json
    end

    assert_response :success
  end

  test 'should show assign_group_place' do
    get assign_group_place_url(@assign_group_place), headers: @headers, as: :json
    assert_response :success
  end

  test 'should update assign_group_place' do
    patch assign_group_place_url(@assign_group_place),
          params: { assign_group_place: { stocker_place_id: @assign_group_place.stocker_place_id, place_order_id: @assign_group_place.place_order_id } },
          headers: @headers, as: :json
    assert_response :ok
  end

  test 'should destroy assign_group_place' do
    assert_difference('AssignGroupPlace.count', -1) do
      delete assign_group_place_url(@assign_group_place), headers: @headers, as: :json
    end

    assert_response :ok
  end

  test 'create is forbidden for non-admin users' do
    assert_no_difference('AssignGroupPlace.count') do
      post assign_group_places_url,
           params: { assign_group_place: { stocker_place_id: @assign_group_place.stocker_place_id, place_order_id: @assign_group_place.place_order_id } },
           headers: auth_headers(@restricted_user), as: :json
    end

    assert_response :forbidden
  end

  test 'index requires authentication' do
    get assign_group_places_url, as: :json
    assert_response :unauthorized
  end

  def create_user!(email:, role_id:)
    User.create!(
      name: email.split('@').first,
      email: email,
      uid: email,
      provider: 'email',
      password: 'password',
      password_confirmation: 'password',
      role_id: role_id
    )
  end

  def auth_headers(user)
    user.create_new_auth_token
  end
end
