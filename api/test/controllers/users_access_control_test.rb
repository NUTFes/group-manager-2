# frozen_string_literal: true

require 'test_helper'

class UsersAccessControlTest < ActionDispatch::IntegrationTest
  self.fixture_table_names = []

  setup do
    Role.create!(id: Role::MANAGER_ID, name: 'manager')
    Role.create!(id: Role::STAFF_ID, name: 'staff')
    Role.create!(id: Role::USER_ID, name: 'user')

    @manager = create_user!('manager-users-access@example.com', Role::MANAGER_ID)
    @staff = create_user!('staff-users-access@example.com', Role::STAFF_ID)
    @user = create_user!('user-users-access@example.com', Role::USER_ID)
  end

  test 'unauthenticated request cannot access users endpoints' do
    get '/current_user', as: :json
    assert_response :unauthorized

    put "/users/#{@user.id}", params: { role_id: Role::STAFF_ID }, as: :json
    assert_response :unauthorized
  end

  test 'user can access only their current user endpoint' do
    get '/current_user', headers: auth_headers(@user), as: :json
    assert_response :success
    assert_equal @user.id, response.parsed_body.fetch('id')

    get '/users', headers: auth_headers(@user), as: :json
    assert_response :forbidden
  end

  test 'staff can read users but cannot change them' do
    get '/users', headers: auth_headers(@staff), as: :json
    assert_response :success

    put "/users/#{@user.id}",
        params: { role_id: Role::STAFF_ID },
        headers: auth_headers(@staff),
        as: :json
    assert_response :forbidden
    assert_equal Role::USER_ID, @user.reload.role_id

    delete "/users/#{@user.id}", headers: auth_headers(@staff), as: :json
    assert_response :forbidden
    assert User.exists?(@user.id)
  end

  test 'manager can change a user' do
    put "/users/#{@user.id}",
        params: { role_id: Role::STAFF_ID },
        headers: auth_headers(@manager),
        as: :json

    assert_response :success
    assert_equal Role::STAFF_ID, @user.reload.role_id
  end

  private

  def create_user!(email, role_id)
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
