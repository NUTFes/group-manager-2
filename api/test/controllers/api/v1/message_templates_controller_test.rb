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

  test 'admin can get templates' do
    first_template = MessageTemplate.create!(valid_params.merge(name: 'Bテンプレート', locale: 'en'))
    second_template = MessageTemplate.create!(valid_params.merge(name: 'Aテンプレート'))
    third_template = MessageTemplate.create!(valid_params.merge(name: 'Bテンプレート'))

    get api_v1_message_templates_path, headers: auth_headers(@admin), as: :json

    assert_response :success
    assert_equal 3, response_data.size
    assert_equal [second_template.id, third_template.id, first_template.id], response_data.pluck('id')
  end

  test 'admin can get template' do
    template = MessageTemplate.create!(valid_params)

    get api_v1_message_template_path(template), headers: auth_headers(@admin), as: :json

    assert_response :success
    assert_template_response(response_data, template)
  end

  test 'admin cannot get missing template' do
    get api_v1_message_template_path(0), headers: auth_headers(@admin), as: :json

    assert_response :not_found
  end

  test 'non admin cannot get templates' do
    get api_v1_message_templates_path, headers: auth_headers(@user), as: :json

    assert_response :forbidden
  end

  test 'unauthenticated request cannot get templates' do
    get api_v1_message_templates_path, as: :json

    assert_response :unauthorized
  end

  test 'non admin cannot create template' do
    assert_no_difference('MessageTemplate.count') do
      post api_v1_message_templates_path,
           params: valid_params,
           headers: auth_headers(@user),
           as: :json
    end

    assert_response :forbidden
  end

  test 'unauthenticated request cannot create template' do
    assert_no_difference('MessageTemplate.count') do
      post api_v1_message_templates_path,
           params: valid_params,
           as: :json
    end

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
    created_template = MessageTemplate.order(:created_at).last
    assert_template_response(response_data, created_template)
  end

  test 'admin cannot create template without required params' do
    assert_no_difference('MessageTemplate.count') do
      post api_v1_message_templates_path,
           params: { locale: 'ja' },
           headers: auth_headers(@admin),
           as: :json
    end

    assert_response :unprocessable_entity
  end

  test 'admin cannot create template with unsupported locale' do
    assert_no_difference('MessageTemplate.count') do
      post api_v1_message_templates_path,
           params: valid_params.merge(locale: 'fr'),
           headers: auth_headers(@admin),
           as: :json
    end

    assert_response :unprocessable_entity
  end

  test 'admin cannot create template with same name in same locale' do
    MessageTemplate.create!(valid_params)

    assert_no_difference('MessageTemplate.count') do
      post api_v1_message_templates_path,
           params: valid_params,
           headers: auth_headers(@admin),
           as: :json
    end

    assert_response :unprocessable_entity
  end

  test 'non admin cannot update template' do
    template = MessageTemplate.create!(valid_params)

    patch api_v1_message_template_path(template),
          params: { subject: '更新後件名' },
          headers: auth_headers(@user),
          as: :json

    assert_response :forbidden
    assert_equal '件名', template.reload.subject
  end

  test 'unauthenticated request cannot update template' do
    template = MessageTemplate.create!(valid_params)

    patch api_v1_message_template_path(template),
          params: { subject: '更新後件名' },
          as: :json

    assert_response :unauthorized
    assert_equal '件名', template.reload.subject
  end

  test 'admin can update template' do
    template = MessageTemplate.create!(valid_params)

    patch api_v1_message_template_path(template),
          params: { subject: '更新後件名', body: '更新後本文' },
          headers: auth_headers(@admin),
          as: :json

    assert_response :success
    assert_equal '更新後件名', template.reload.subject
    assert_template_response(response_data, template)
  end

  test 'admin cannot update missing template' do
    patch api_v1_message_template_path(0),
          params: { subject: '更新後件名' },
          headers: auth_headers(@admin),
          as: :json

    assert_response :not_found
  end

  test 'admin cannot update template with blank body' do
    template = MessageTemplate.create!(valid_params)

    patch api_v1_message_template_path(template),
          params: { body: '' },
          headers: auth_headers(@admin),
          as: :json

    assert_response :unprocessable_entity
    assert_equal '本文', template.reload.body
  end

  test 'admin cannot update template with unsupported locale' do
    template = MessageTemplate.create!(valid_params)

    patch api_v1_message_template_path(template),
          params: { locale: 'fr' },
          headers: auth_headers(@admin),
          as: :json

    assert_response :unprocessable_entity
    assert_equal 'ja', template.reload.locale
  end

  test 'admin cannot update template to same name in same locale' do
    template = MessageTemplate.create!(valid_params)
    other_template = MessageTemplate.create!(valid_params.merge(name: '別テンプレート'))

    patch api_v1_message_template_path(other_template),
          params: { name: template.name, locale: template.locale },
          headers: auth_headers(@admin),
          as: :json

    assert_response :unprocessable_entity
    assert_equal '別テンプレート', other_template.reload.name
  end

  test 'non admin cannot create template copy' do
    template = MessageTemplate.create!(valid_params)

    assert_no_difference('MessageTemplate.count') do
      post create_copy_api_v1_message_template_path(template),
           headers: auth_headers(@user),
           as: :json
    end

    assert_response :forbidden
  end

  test 'unauthenticated request cannot create template copy' do
    template = MessageTemplate.create!(valid_params)

    assert_no_difference('MessageTemplate.count') do
      post create_copy_api_v1_message_template_path(template), as: :json
    end

    assert_response :unauthorized
  end

  test 'admin can create template copy from source template' do
    template = MessageTemplate.create!(valid_params)

    assert_difference('MessageTemplate.count', 1) do
      post create_copy_api_v1_message_template_path(template),
           headers: auth_headers(@admin),
           as: :json
    end

    assert_response :created
    copied_template = MessageTemplate.order(:created_at).last
    assert_equal 'GM再提出依頼 のコピー', copied_template.name
    assert_equal template.locale, copied_template.locale
    assert_equal template.subject, copied_template.subject
    assert_equal template.body, copied_template.body
    assert_template_response(response_data, copied_template)
  end

  test 'admin can create template copy with overrides' do
    template = MessageTemplate.create!(valid_params)

    post create_copy_api_v1_message_template_path(template),
         params: { name: '英語コピー', locale: 'en' },
         headers: auth_headers(@admin),
         as: :json

    assert_response :created
    copied_template = MessageTemplate.order(:created_at).last
    assert_equal '英語コピー', copied_template.name
    assert_equal 'en', copied_template.locale
    assert_equal template.subject, copied_template.subject
    assert_equal template.body, copied_template.body
    assert_template_response(response_data, copied_template)
  end

  test 'admin cannot create template copy from missing source template' do
    assert_no_difference('MessageTemplate.count') do
      post create_copy_api_v1_message_template_path(0),
           headers: auth_headers(@admin),
           as: :json
    end

    assert_response :not_found
  end

  test 'admin cannot create template copy with same name in same locale' do
    template = MessageTemplate.create!(valid_params)
    MessageTemplate.create!(valid_params.merge(name: '既存コピー'))

    assert_no_difference('MessageTemplate.count') do
      post create_copy_api_v1_message_template_path(template),
           params: { name: '既存コピー' },
           headers: auth_headers(@admin),
           as: :json
    end

    assert_response :unprocessable_entity
  end

  test 'admin cannot create template copy with unsupported locale' do
    template = MessageTemplate.create!(valid_params)

    assert_no_difference('MessageTemplate.count') do
      post create_copy_api_v1_message_template_path(template),
           params: { locale: 'fr' },
           headers: auth_headers(@admin),
           as: :json
    end

    assert_response :unprocessable_entity
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

  def response_data
    response.parsed_body['data']
  end

  def assert_template_response(data, template)
    assert_equal template.id, data['id']
    assert_equal template.name, data['name']
    assert_equal template.locale, data['locale']
    assert_equal template.subject, data['subject']
    assert_equal template.body, data['body']
  end
end
