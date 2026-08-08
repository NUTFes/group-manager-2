# frozen_string_literal: true

require 'test_helper'

class HighRiskAccessControlTest < ActionDispatch::IntegrationTest
  self.fixture_table_names = []

  setup do
    Role.create!(id: Role::MANAGER_ID, name: 'manager')
    Role.create!(id: Role::STAFF_ID, name: 'staff')
    Role.create!(id: Role::USER_ID, name: 'user')

    @staff = create_user!('staff-high-risk@example.com', Role::STAFF_ID)
    @user = create_user!('user-high-risk@example.com', Role::USER_ID)
  end

  test 'unauthenticated request cannot create or update groups' do
    post '/groups', as: :json
    assert_response :unauthorized

    patch '/groups/999999', as: :json
    assert_response :unauthorized
  end

  test 'user cannot list or destroy groups' do
    get '/groups', headers: auth_headers(@user), as: :json
    assert_response :forbidden

    delete '/groups/999999', headers: auth_headers(@user), as: :json
    assert_response :forbidden
  end

  test 'staff can list groups' do
    get '/groups', headers: auth_headers(@staff), as: :json

    assert_response :success
  end

  test 'user cannot output pdf' do
    get '/print_pdf/group_all/1/output',
        headers: auth_headers(@user),
        as: :json

    assert_response :forbidden
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
