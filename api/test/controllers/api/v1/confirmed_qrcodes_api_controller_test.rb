# frozen_string_literal: true

require 'test_helper'

class Api::V1::ConfirmedQrcodesApiControllerTest < ActionDispatch::IntegrationTest
  self.fixture_table_names = []

  setup do
    Role.create!(id: 1, name: 'manager')
    @manager = User.create!(
      name: 'confirmed-qrcode-manager',
      email: 'confirmed-qrcode-manager@example.com',
      uid: 'confirmed-qrcode-manager@example.com',
      provider: 'email',
      password: 'password',
      password_confirmation: 'password',
      role_id: 1
    )
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

  private

  def get_confirmed_qrcode
    get "/api/v1/get_confirmed_qrcode_for_admin_view/#{@group.id}",
        headers: @manager.create_new_auth_token,
        as: :json
  end
end
