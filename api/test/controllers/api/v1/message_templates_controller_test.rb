# frozen_string_literal: true

require 'test_helper'

class Api::V1::MessageTemplatesControllerTest < ActionDispatch::IntegrationTest
  self.fixture_table_names = []

  setup do
    MessageTemplate.delete_all
    Role.create!(id: 1, name: 'admin')
    Role.create!(id: 2, name: 'user')
    @admin = create_user!(email: 'admin-template@example.com', role_id: 1)
    @user = create_user!(email: 'user-template@example.com', role_id: 2)
  end

  test 'admin can get default templates' do
    get api_v1_message_templates_path, headers: auth_headers(@admin), as: :json

    assert_response :success
    assert_equal 2, response.parsed_body['data'].size
  end

  test 'non admin cannot get templates' do
    get api_v1_message_templates_path, headers: auth_headers(@user), as: :json

    assert_response :forbidden
  end

  test 'unauthenticated request cannot get templates' do
    get api_v1_message_templates_path, as: :json

    assert_response :unauthorized
  end

  test 'admin can create template' do
    assert_difference('MessageTemplate.count', 1) do
      post api_v1_message_templates_path,
           params: valid_params.merge(name: '任意テンプレート'),
           headers: auth_headers(@admin),
           as: :json
    end

    assert_response :created
  end

  test 'admin can update template' do
    template = MessageTemplate.create!(valid_params)

    patch api_v1_message_template_path(template),
          params: { subject: '更新後件名', body: '更新後本文' },
          headers: auth_headers(@admin),
          as: :json

    assert_response :success
    assert_equal '更新後件名', template.reload.subject
  end

  test 'admin can duplicate template' do
    template = MessageTemplate.create!(valid_params)

    assert_difference('MessageTemplate.count', 1) do
      post duplicate_api_v1_message_template_path(template),
           headers: auth_headers(@admin),
           as: :json
    end

    assert_response :created
    duplicated = MessageTemplate.order(:created_at).last
    assert_equal 'GM再提出依頼 のコピー', duplicated.name
    assert_equal template.locale, duplicated.locale
    assert_equal template.subject, duplicated.subject
    assert_equal template.body, duplicated.body
  end

  test 'admin can duplicate template with overrides' do
    template = MessageTemplate.create!(valid_params)

    post duplicate_api_v1_message_template_path(template),
         params: { name: '英語コピー', locale: 'en' },
         headers: auth_headers(@admin),
         as: :json

    assert_response :created
    duplicated = MessageTemplate.order(:created_at).last
    assert_equal '英語コピー', duplicated.name
    assert_equal 'en', duplicated.locale
    assert_equal template.subject, duplicated.subject
    assert_equal template.body, duplicated.body
  end

  private

  def valid_params
    {
      locale: 'ja',
      name: 'GM再提出依頼',
      subject: '件名',
      body: '本文'
    }
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
