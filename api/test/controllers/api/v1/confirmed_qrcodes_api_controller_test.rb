# frozen_string_literal: true

require 'test_helper'

class Api::V1::ConfirmedQrcodesApiControllerTest < ActionDispatch::IntegrationTest
  self.fixture_table_names = []

  setup do
    Role.create!(id: 1, name: 'admin')
    Role.create!(id: 2, name: 'staff')
    Role.create!(id: 3, name: 'user')
    @manager = create_user!(email: 'confirmed-qrcode-manager@example.com', role_id: 1)
    @staff = create_user!(email: 'confirmed-qrcode-staff@example.com', role_id: 2)
    @general_user = create_user!(email: 'confirmed-qrcode-user@example.com', role_id: 3)
    category = GroupCategory.create!(name: '食品販売')
    year = FesYear.create!(year_num: 2026)
    @group = Group.create!(
      name: 'QR発行団体',
      project_name: 'QR発行企画',
      activity: '活動内容',
      user: @manager,
      group_category: category,
      fes_year: year
    )
  end

  test 'returns confirmed_url containing group_id and secret' do
    get_confirmed_qrcode

    assert_response :success
    confirmed_url = response.parsed_body.dig('data', 'confirmed_url')
    assert_includes confirmed_url, "group_id=#{@group.id}"
    assert_includes confirmed_url, "secret=#{@group.secret}"
  end

  test 'returns qrcode_png as a data uri' do
    get_confirmed_qrcode

    assert_response :success
    qrcode_png = response.parsed_body.dig('data', 'qrcode_png')
    assert_match(%r{\Adata:image/png;base64,}, qrcode_png)
  end

  test 'returns not found for unknown group' do
    get "/api/v1/get_confirmed_qrcode_for_admin_view/#{@group.id + 1000}",
        headers: @manager.create_new_auth_token,
        as: :json

    assert_response :not_found
    assert_equal 404, response.parsed_body.dig('status', 'code')
  end

  test 'unauthenticated request cannot get qrcode' do
    get "/api/v1/get_confirmed_qrcode_for_admin_view/#{@group.id}", as: :json

    assert_response :unauthorized
  end

  test 'general user cannot get qrcode' do
    get "/api/v1/get_confirmed_qrcode_for_admin_view/#{@group.id}",
        headers: @general_user.create_new_auth_token,
        as: :json

    assert_response :forbidden
  end

  test 'staff can get qrcode' do
    get "/api/v1/get_confirmed_qrcode_for_admin_view/#{@group.id}",
        headers: @staff.create_new_auth_token,
        as: :json

    assert_response :success
  end

  test 'user view returns qrcode without authentication when secret matches' do
    get "/api/v1/get_confirmed_qrcode_for_user_view/#{@group.id}", params: { secret: @group.secret }

    assert_response :success
    qrcode_png = response.parsed_body.dig('data', 'qrcode_png')
    assert_match(%r{\Adata:image/png;base64,}, qrcode_png)
  end

  test 'user view returns not found when secret does not match' do
    get "/api/v1/get_confirmed_qrcode_for_user_view/#{@group.id}", params: { secret: 'wrong-secret' }

    assert_response :not_found
  end

  test 'user view returns not found when secret is missing' do
    get "/api/v1/get_confirmed_qrcode_for_user_view/#{@group.id}"

    assert_response :not_found
  end

  test 'user view returns not found for unknown group' do
    get "/api/v1/get_confirmed_qrcode_for_user_view/#{@group.id + 1000}", params: { secret: @group.secret }

    assert_response :not_found
  end

  private

  def get_confirmed_qrcode
    get "/api/v1/get_confirmed_qrcode_for_admin_view/#{@group.id}",
        headers: @manager.create_new_auth_token,
        as: :json
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
end
