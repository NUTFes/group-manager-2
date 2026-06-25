# frozen_string_literal: true

require 'test_helper'

class Api::V1::MailDeliveriesControllerTest < ActionDispatch::IntegrationTest
  self.fixture_table_names = []

  setup do
    @original_gmail_address = ENV.fetch('GMAIL_ADDRESS', nil)
    ENV['GMAIL_ADDRESS'] = 'no-reply@example.com'
    ActionMailer::Base.deliveries.clear
    Role.create!(id: 1, name: 'admin')
    Role.create!(id: 2, name: 'staff')
    Role.create!(id: 3, name: 'user')
    @admin = create_user!(email: 'admin@example.com', role_id: 1)
    @staff = create_user!(email: 'staff@example.com', role_id: 2)
    @user = create_user!(email: 'user@example.com', role_id: 3)
  end

  teardown do
    ENV['GMAIL_ADDRESS'] = @original_gmail_address
  end

  test 'admin can deliver a mail' do
    assert_difference -> { ActionMailer::Base.deliveries.size }, 1 do
      post api_v1_mail_deliveries_path,
           params: valid_params,
           headers: auth_headers(@admin),
           as: :json
    end

    assert_response :success
    mail = ActionMailer::Base.deliveries.last
    assert_equal ['recipient@example.com'], mail.to
    assert_equal ['no-reply@example.com'], mail.from
    assert_equal 'テスト件名', mail.subject
    assert_equal 'テスト本文', mail.body.encoded
  end

  # 送信直前のテンプレート変数置換。
  # 本文中の{group_name}/{user_name}が実際に配送されるメール本文で置換されることを確認する。
  test 'admin can deliver a mail with rendered template variables' do
    assert_difference -> { ActionMailer::Base.deliveries.size }, 1 do
      post api_v1_mail_deliveries_path,
           params: valid_params.merge(
             subject: '再提出依頼: {group_name}',
             body: '{group_name} 代表 {user_name} 様',
             template_values: {
               group_name: '技大祭企画',
               user_name: '山田太郎'
             }
           ),
           headers: auth_headers(@admin),
           as: :json
    end

    assert_response :success
    mail = ActionMailer::Base.deliveries.last
    assert_equal '再提出依頼: 技大祭企画', mail.subject
    assert_equal '技大祭企画 代表 山田太郎 様',
                 mail.body.encoded.gsub(/\r\n?/, "\n")
  end

  # 暫定権限の正常系。role_id 2 の staff でもメール送信APIを利用できることを確認する。
  test 'staff can deliver a mail' do
    assert_difference -> { ActionMailer::Base.deliveries.size }, 1 do
      post api_v1_mail_deliveries_path,
           params: valid_params,
           headers: auth_headers(@staff),
           as: :json
    end

    assert_response :success
  end

  test 'general user cannot deliver a mail' do
    assert_no_difference -> { ActionMailer::Base.deliveries.size } do
      post api_v1_mail_deliveries_path,
           params: valid_params,
           headers: auth_headers(@user),
           as: :json
    end

    assert_response :forbidden
  end

  test 'unauthenticated request cannot deliver a mail' do
    assert_no_difference -> { ActionMailer::Base.deliveries.size } do
      post api_v1_mail_deliveries_path, params: valid_params, as: :json
    end

    assert_response :unauthorized
  end

  test 'missing required params returns unprocessable entity' do
    assert_no_difference -> { ActionMailer::Base.deliveries.size } do
      post api_v1_mail_deliveries_path,
           params: { to: '', subject: '', body: '' },
           headers: auth_headers(@admin),
           as: :json
    end

    assert_response :unprocessable_entity
  end

  test 'invalid email returns unprocessable entity' do
    assert_no_difference -> { ActionMailer::Base.deliveries.size } do
      post api_v1_mail_deliveries_path,
           params: valid_params.merge(to: 'not-an-email'),
           headers: auth_headers(@admin),
           as: :json
    end

    assert_response :unprocessable_entity
  end

  test 'multiple recipients return unprocessable entity' do
    assert_no_difference -> { ActionMailer::Base.deliveries.size } do
      post api_v1_mail_deliveries_path,
           params: valid_params.merge(to: 'one@example.com,two@example.com'),
           headers: auth_headers(@admin),
           as: :json
    end

    assert_response :unprocessable_entity
    assert_includes response.parsed_body['data'], 'to must be a single email address'
  end

  test 'space separated multiple recipients return unprocessable entity' do
    assert_no_difference -> { ActionMailer::Base.deliveries.size } do
      post api_v1_mail_deliveries_path,
           params: valid_params.merge(to: 'one@example.com two@example.com'),
           headers: auth_headers(@admin),
           as: :json
    end

    assert_response :unprocessable_entity
    assert_includes response.parsed_body['data'], 'to must be a single email address'
  end

  test 'multiple display-name recipients return unprocessable entity' do
    assert_no_difference -> { ActionMailer::Base.deliveries.size } do
      post api_v1_mail_deliveries_path,
           params: valid_params.merge(to: 'One <one@example.com> Two <two@example.com>'),
           headers: auth_headers(@admin),
           as: :json
    end

    assert_response :unprocessable_entity
    assert_includes response.parsed_body['data'], 'to must be a single email address'
  end

  private

  def valid_params
    {
      to: 'recipient@example.com',
      subject: 'テスト件名',
      body: 'テスト本文'
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
