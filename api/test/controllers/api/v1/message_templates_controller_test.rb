# frozen_string_literal: true

require 'test_helper'

class Api::V1::MessageTemplatesControllerTest < ActionDispatch::IntegrationTest
  self.fixture_table_names = []

  setup do
    MessageTemplate.delete_all
    Role.create!(id: 1, name: 'admin')
    Role.create!(id: 2, name: 'user')
    Role.create!(id: 3, name: 'guest')
    @admin = create_user!(email: 'admin-template@example.com', role_id: 1)
    @operator = create_user!(email: 'operator-template@example.com', role_id: 2)
    @restricted_user = create_user!(email: 'restricted-template@example.com', role_id: 3)
  end

  # 一覧取得の正常系。管理者がテンプレート一覧を取得でき、name/locale順で返ることを確認する。
  test 'admin can get templates' do
    first_template = MessageTemplate.create!(valid_params.merge(name: 'Bテンプレート', locale: 'en'))
    second_template = MessageTemplate.create!(valid_params.merge(name: 'Aテンプレート'))
    third_template = MessageTemplate.create!(valid_params.merge(name: 'Bテンプレート'))

    get api_v1_message_templates_path, headers: auth_headers(@admin), as: :json

    assert_response :success
    assert_equal 3, response_data.size
    assert_equal [second_template.id, third_template.id, first_template.id], response_data.pluck('id')
  end

  # 一覧取得の正常系。暫定的に許可対象としているrole_id 2でもテンプレート一覧を取得できることを確認する。
  test 'role 2 user can get templates' do
    MessageTemplate.create!(valid_params)

    get api_v1_message_templates_path, headers: auth_headers(@operator), as: :json

    assert_response :success
    assert_equal 1, response_data.size
  end

  # 詳細取得の正常系。管理者が指定IDのテンプレートを取得でき、レスポンス内容がDBと一致することを確認する。
  test 'admin can get template' do
    template = MessageTemplate.create!(valid_params)

    get api_v1_message_template_path(template), headers: auth_headers(@admin), as: :json

    assert_response :success
    assert_template_response(response_data, template)
  end

  # 詳細取得の失敗系。存在しないIDを指定した場合に404を返すことを確認する。
  test 'admin cannot get missing template' do
    get api_v1_message_template_path(0), headers: auth_headers(@admin), as: :json

    assert_response :not_found
  end

  # 認可の失敗系。許可対象外のroleでは一覧取得できないことを確認する。
  test 'restricted user cannot get templates' do
    get api_v1_message_templates_path, headers: auth_headers(@restricted_user), as: :json

    assert_response :forbidden
  end

  # 認証の失敗系。未認証では一覧取得できないことを確認する。
  test 'unauthenticated request cannot get templates' do
    get api_v1_message_templates_path, as: :json

    assert_response :unauthorized
  end

  # 作成時の認可失敗系。許可対象外のroleではテンプレートを作成できないことを確認する。
  test 'restricted user cannot create template' do
    assert_no_difference('MessageTemplate.count') do
      post api_v1_message_templates_path,
           params: valid_params,
           headers: auth_headers(@restricted_user),
           as: :json
    end

    assert_response :forbidden
  end

  # 作成時の認証失敗系。未認証ではテンプレートを作成できないことを確認する。
  test 'unauthenticated request cannot create template' do
    assert_no_difference('MessageTemplate.count') do
      post api_v1_message_templates_path,
           params: valid_params,
           as: :json
    end

    assert_response :unauthorized
  end

  # 作成の正常系。管理者がテンプレートを作成でき、作成後のレスポンス内容がDBと一致することを確認する。
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

  # 作成の正常系。暫定的に許可対象としているrole_id 2でもテンプレートを作成できることを確認する。
  test 'role 2 user can create template' do
    assert_difference('MessageTemplate.count', 1) do
      post api_v1_message_templates_path,
           params: valid_params.merge(name: 'role2テンプレート'),
           headers: auth_headers(@operator),
           as: :json
    end

    assert_response :created
  end

  # 作成時のバリデーション失敗系。必須項目不足では作成されず422を返すことを確認する。
  test 'admin cannot create template without required params' do
    assert_no_difference('MessageTemplate.count') do
      post api_v1_message_templates_path,
           params: { locale: 'ja' },
           headers: auth_headers(@admin),
           as: :json
    end

    assert_response :unprocessable_entity
  end

  # 作成時のバリデーション失敗系。enum未定義のlocaleでは作成されず422を返すことを確認する。
  test 'admin cannot create template with unsupported locale' do
    assert_no_difference('MessageTemplate.count') do
      post api_v1_message_templates_path,
           params: valid_params.merge(locale: 'fr'),
           headers: auth_headers(@admin),
           as: :json
    end

    assert_response :unprocessable_entity
  end

  # 作成時の一意制約失敗系。同一locale内で同じnameのテンプレートを作成できないことを確認する。
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

  # 更新時の認可失敗系。許可対象外のroleではテンプレートを更新できず、DB内容も変わらないことを確認する。
  test 'restricted user cannot update template' do
    template = MessageTemplate.create!(valid_params)

    patch api_v1_message_template_path(template),
          params: { subject: '更新後件名' },
          headers: auth_headers(@restricted_user),
          as: :json

    assert_response :forbidden
    assert_equal '件名', template.reload.subject
  end

  # 更新時の認証失敗系。未認証ではテンプレートを更新できず、DB内容も変わらないことを確認する。
  test 'unauthenticated request cannot update template' do
    template = MessageTemplate.create!(valid_params)

    patch api_v1_message_template_path(template),
          params: { subject: '更新後件名' },
          as: :json

    assert_response :unauthorized
    assert_equal '件名', template.reload.subject
  end

  # 更新の正常系。管理者がPATCHで一部項目を更新でき、レスポンス内容が更新後DBと一致することを確認する。
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

  # 更新の正常系。暫定的に許可対象としているrole_id 2でもテンプレートを更新できることを確認する。
  test 'role 2 user can update template' do
    template = MessageTemplate.create!(valid_params)

    patch api_v1_message_template_path(template),
          params: { subject: 'role2更新後件名' },
          headers: auth_headers(@operator),
          as: :json

    assert_response :success
    assert_equal 'role2更新後件名', template.reload.subject
  end

  # 更新時の失敗系。存在しないIDを指定した場合に404を返すことを確認する。
  test 'admin cannot update missing template' do
    patch api_v1_message_template_path(0),
          params: { subject: '更新後件名' },
          headers: auth_headers(@admin),
          as: :json

    assert_response :not_found
  end

  # 更新時のバリデーション失敗系。bodyを空に更新できず、DB内容も変わらないことを確認する。
  test 'admin cannot update template with blank body' do
    template = MessageTemplate.create!(valid_params)

    patch api_v1_message_template_path(template),
          params: { body: '' },
          headers: auth_headers(@admin),
          as: :json

    assert_response :unprocessable_entity
    assert_equal '本文', template.reload.body
  end

  # 更新時のバリデーション失敗系。enum未定義のlocaleへ更新できず、DB内容も変わらないことを確認する。
  test 'admin cannot update template with unsupported locale' do
    template = MessageTemplate.create!(valid_params)

    patch api_v1_message_template_path(template),
          params: { locale: 'fr' },
          headers: auth_headers(@admin),
          as: :json

    assert_response :unprocessable_entity
    assert_equal 'ja', template.reload.locale
  end

  # 更新時の一意制約失敗系。同一locale内で既存テンプレートと同じnameへ更新できないことを確認する。
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

  # コピー元取得時の認可失敗系。許可対象外のroleでは複製用の初期値を取得できないことを確認する。
  test 'restricted user cannot get template copy source' do
    template = MessageTemplate.create!(valid_params)

    assert_no_difference('MessageTemplate.count') do
      get copy_source_api_v1_message_template_path(template), headers: auth_headers(@restricted_user), as: :json
    end

    assert_response :forbidden
  end

  # コピー元取得時の認証失敗系。未認証では複製用の初期値を取得できないことを確認する。
  test 'unauthenticated request cannot get template copy source' do
    template = MessageTemplate.create!(valid_params)

    assert_no_difference('MessageTemplate.count') do
      get copy_source_api_v1_message_template_path(template), as: :json
    end

    assert_response :unauthorized
  end

  # コピー元取得の正常系。DB保存せず、複製編集フォーム用の初期値を返すことを確認する。
  test 'admin can get template copy source' do
    template = MessageTemplate.create!(valid_params)

    assert_no_difference('MessageTemplate.count') do
      get copy_source_api_v1_message_template_path(template), headers: auth_headers(@admin), as: :json
    end

    assert_response :success
    assert_equal template.locale, response_data['locale']
    assert_equal 'GM再提出依頼 のコピー', response_data['name']
    assert_equal template.subject, response_data['subject']
    assert_equal template.body, response_data['body']
  end

  # コピー元取得の正常系。英語テンプレートでは英語用suffixのcopy nameを返すことを確認する。
  test 'admin can get english template copy source' do
    template = MessageTemplate.create!(valid_params.merge(locale: 'en', name: 'Resubmission Request'))

    assert_no_difference('MessageTemplate.count') do
      get copy_source_api_v1_message_template_path(template), headers: auth_headers(@admin), as: :json
    end

    assert_response :success
    assert_equal 'Resubmission Request copy', response_data['name']
  end

  # コピー元取得の正常系。暫定的に許可対象としているrole_id 2でも複製用の初期値を取得できることを確認する。
  test 'role 2 user can get template copy source' do
    template = MessageTemplate.create!(valid_params)

    assert_no_difference('MessageTemplate.count') do
      get copy_source_api_v1_message_template_path(template), headers: auth_headers(@operator), as: :json
    end

    assert_response :success
    assert_equal 'GM再提出依頼 のコピー', response_data['name']
  end

  # コピー元取得時の失敗系。存在しない元テンプレートIDを指定した場合に404を返すことを確認する。
  test 'admin cannot get template copy source from missing source template' do
    assert_no_difference('MessageTemplate.count') do
      get copy_source_api_v1_message_template_path(0), headers: auth_headers(@admin), as: :json
    end

    assert_response :not_found
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
