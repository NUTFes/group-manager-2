# frozen_string_literal: true

require 'test_helper'

class Api::V1::MailDeliveriesControllerTest < ActionDispatch::IntegrationTest
  self.fixture_table_names = []

  setup do
    @original_gmail_address = ENV.fetch('GMAIL_ADDRESS', nil)
    ENV['GMAIL_ADDRESS'] = 'no-reply@example.com'
    ActionMailer::Base.deliveries.clear
    Role.create!(id: 1, name: 'admin')
    Role.create!(id: 2, name: 'user')
    @admin = create_user!(email: 'admin@example.com', role_id: 1)
    @user = create_user!(email: 'user@example.com', role_id: 2)
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

  test 'non admin cannot deliver a mail' do
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
