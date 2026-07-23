# frozen_string_literal: true

require 'test_helper'

class HighRiskAccessControlTest < ActionDispatch::IntegrationTest
  self.fixture_table_names = []

  setup do
    Role.create!(id: Role::MANAGER_ID, name: 'manager')
    Role.create!(id: Role::STAFF_ID, name: 'staff')
    Role.create!(id: 3, name: 'participant')

    @staff = create_user!('staff-high-risk@example.com', Role::STAFF_ID)
    @participant = create_user!('participant-high-risk@example.com', 3)
  end

  test 'unauthenticated request cannot create or update groups' do
    post '/groups', as: :json
    assert_response :unauthorized

    patch '/groups/999999', as: :json
    assert_response :unauthorized
  end

  test 'participant cannot list or destroy groups' do
    get '/groups', headers: auth_headers(@participant), as: :json
    assert_response :forbidden

    delete '/groups/999999', headers: auth_headers(@participant), as: :json
    assert_response :forbidden
  end

  test 'staff can list groups' do
    get '/groups', headers: auth_headers(@staff), as: :json

    assert_response :success
  end

  test 'participant cannot output pdf' do
    get '/print_pdf/group_all/1/output',
        headers: auth_headers(@participant),
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
