# frozen_string_literal: true

require 'test_helper'

class Api::V1::BaseControllerTest < ActionDispatch::IntegrationTest
  self.fixture_table_names = []

  setup do
    Role.create!(id: 1, name: 'admin')
    Role.create!(id: 2, name: 'staff')
    Role.create!(id: 3, name: 'user')

    @admin = create_user!(email: 'admin-v1-base@example.com', role_id: 1)
    @staff = create_user!(email: 'staff-v1-base@example.com', role_id: 2)
    @user = create_user!(email: 'user-v1-base@example.com', role_id: 3)
  end

  # 認可の正常系。role_id 1 の manager は v1 API を利用できる。
  test 'manager can access v1 api' do
    get '/api/v1/get_refinement_fes_date_by_fes_year/0',
        headers: auth_headers(@admin),
        as: :json

    assert_response :success
  end

  # 認可の正常系。role_id 2 の staff は v1 API を利用できる。
  test 'staff can access v1 api' do
    get '/api/v1/get_refinement_fes_date_by_fes_year/0',
        headers: auth_headers(@staff),
        as: :json

    assert_response :success
  end

  # 認可の失敗系。role_id 3 の user は v1 API を利用できない。
  test 'general user cannot access v1 api' do
    get '/api/v1/get_refinement_fes_date_by_fes_year/0',
        headers: auth_headers(@user),
        as: :json

    assert_response :forbidden
  end

  # 認証の失敗系。未認証リクエストは v1 API を利用できない。
  test 'unauthenticated request cannot access v1 api' do
    get '/api/v1/get_refinement_fes_date_by_fes_year/0', as: :json

    assert_response :unauthorized
  end

  # 認証の失敗系。無効な認証トークンでは v1 API を利用できない。
  test 'request with invalid token cannot access v1 api' do
    get '/api/v1/get_refinement_fes_date_by_fes_year/0',
        headers: invalid_auth_headers,
        as: :json

    assert_response :unauthorized
  end

  private

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

  def invalid_auth_headers
    {
      'access-token' => 'invalid-token',
      'client' => 'invalid-client',
      'uid' => @admin.uid
    }
  end
end
