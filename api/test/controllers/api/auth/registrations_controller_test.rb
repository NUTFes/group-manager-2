# frozen_string_literal: true

require 'test_helper'

class Api::Auth::RegistrationsControllerTest < ActionDispatch::IntegrationTest
  self.fixture_table_names = []

  setup do
    Role.create!(id: Role::MANAGER_ID, name: 'manager')
    Role.create!(id: Role::STAFF_ID, name: 'staff')
    Role.create!(id: Role::USER_ID, name: 'user')
  end

  test 'public registration always creates a user' do
    assert_difference('User.count', 1) do
      post '/api/auth',
           params: {
             registration: {
               name: 'registration test',
               email: 'registration-test@example.com',
               password: 'password',
               password_confirmation: 'password',
               role_id: Role::MANAGER_ID
             }
           },
           as: :json
    end

    assert_response :success
    assert_equal Role::USER_ID, User.find_by!(email: 'registration-test@example.com').role_id
  end

  test 'user cannot elevate their role through account update' do
    user = create_role_user!

    put '/api/auth',
        params: { name: 'updated user', role_id: Role::MANAGER_ID },
        headers: user.create_new_auth_token,
        as: :json

    assert_response :success
    assert_equal 'updated user', user.reload.name
    assert_equal Role::USER_ID, user.role_id
  end

  private

  def create_role_user!
    User.create!(
      name: 'user',
      email: 'user-registration@example.com',
      uid: 'user-registration@example.com',
      provider: 'email',
      password: 'password',
      password_confirmation: 'password',
      role_id: Role::USER_ID
    )
  end
end
