# frozen_string_literal: true

require 'test_helper'

class Api::V1::OrderStatusCheckCommentMailsControllerTest < ActionDispatch::IntegrationTest
  self.fixture_table_names = []

  setup do
    @original_gmail_address = ENV.fetch('GMAIL_ADDRESS', nil)
    ENV['GMAIL_ADDRESS'] = 'no-reply@example.com'
    ActionMailer::Base.deliveries.clear

    Role.find_or_create_by!(id: 1, name: 'admin')
    Role.find_or_create_by!(id: 2, name: 'staff')
    Role.find_or_create_by!(id: 3, name: 'user')
    @admin = create_user!(email: 'admin-order-mail@example.com', role_id: 1)
    @staff = create_user!(email: 'staff-order-mail@example.com', role_id: 2)
    @user = create_user!(email: 'user-order-mail@example.com', role_id: 3)
    @representative = create_user!(email: 'rep-order@example.com', role_id: 1)
    group_category = GroupCategory.find_or_create_by!(name: '食品販売')
    fes_year = FesYear.find_or_create_by!(year_num: 2026)
    @group = Group.create!(
      name: '技大祭企画',
      project_name: '食品販売',
      activity: '食品販売',
      user: @representative,
      group_category: group_category,
      fes_year: fes_year
    )
  end

  teardown do
    ENV['GMAIL_ADDRESS'] = @original_gmail_address
  end

  # 正常系: メモをfailedで保存後、メール送信成功時にsentへ更新する。
  test 'creates failed comment first and marks it sent when mail delivery succeeds' do
    assert_difference('Comment.count', 1) do
      assert_difference -> { ActionMailer::Base.deliveries.size }, 1 do
        post '/api/v1/order_status_check_comment_mails',
             params: valid_params,
             headers: auth_headers(@admin),
             as: :json
      end
    end

    assert_response :created
    comment = Comment.last
    assert comment.sent?
    assert_equal 'sent', response.parsed_body['data']['mail_delivery_status']
    assert_equal '再提出依頼: 技大祭企画', comment.subject
    assert_equal '食品名を修正してください。', comment.body
  end

  # 暫定権限の正常系。role_id 2 の staff でもメール送信付きメモを作成できることを確認する。
  test 'staff can create comment with mail delivery' do
    assert_difference('Comment.count', 1) do
      assert_difference -> { ActionMailer::Base.deliveries.size }, 1 do
        post '/api/v1/order_status_check_comment_mails',
             params: valid_params,
             headers: auth_headers(@staff),
             as: :json
      end
    end

    assert_response :created
    assert Comment.last.sent?
  end

  # 権限: role_id 1/2 以外は代表者へのメール送信付きメモを作成できない。
  test 'general user cannot create comment with mail delivery' do
    assert_no_difference('Comment.count') do
      assert_no_difference -> { ActionMailer::Base.deliveries.size } do
        post '/api/v1/order_status_check_comment_mails',
             params: valid_params,
             headers: auth_headers(@user),
             as: :json
      end
    end

    assert_response :forbidden
  end

  # 異常系: バリデーションエラー
  test 'fails when group_id is missing' do
    post '/api/v1/order_status_check_comment_mails',
         params: valid_params.except(:group_id),
         headers: auth_headers(@admin),
         as: :json

    assert_response :unprocessable_entity
    assert_includes response.parsed_body['data'], 'group_id is required'
  end

  # 異常系: subjectが未指定の場合はメール送信付きメモを作成できない。
  test 'fails when subject is missing' do
    assert_no_difference('Comment.count') do
      post '/api/v1/order_status_check_comment_mails',
           params: valid_params.except(:subject),
           headers: auth_headers(@admin),
           as: :json
    end

    assert_response :unprocessable_entity
    assert_includes response.parsed_body['data'], 'subject is required'
  end

  # 正常系: メモをメール送信せずmemoで保存する。
  test 'creates a memo comment without mail delivery' do
    assert_difference('Comment.count', 1) do
      assert_no_difference -> { ActionMailer::Base.deliveries.size } do
        post '/api/v1/create_order_status_check_comment',
             params: valid_params,
             headers: auth_headers(@admin),
             as: :json
      end
    end

    assert_response :created
    comment = Comment.last
    assert comment.memo?
    assert_equal 'memo', response.parsed_body['data']['mail_delivery_status']
  end

  # 異常系: group_idが存在しない場合は404を返す。
  test 'fails to create memo comment when group does not exist' do
    post '/api/v1/create_order_status_check_comment',
         params: valid_params.merge(group_id: 0),
         headers: auth_headers(@admin),
         as: :json

    assert_response :not_found
  end

  # 異常系: subjectが未指定の場合はメモを作成できない。
  test 'fails to create memo comment when subject is missing' do
    post '/api/v1/create_order_status_check_comment',
         params: valid_params.except(:subject),
         headers: auth_headers(@admin),
         as: :json

    assert_response :unprocessable_entity
    assert_includes response.parsed_body['data'], 'subject is required'
  end

  # 再送信正常系
  test 'resends failed comment' do
    comment = @group.comments.create!(
      subject: '再提出依頼: 技大祭企画',
      body: '食品名を修正してください。',
      mail_delivery_status: :failed
    )

    assert_difference -> { ActionMailer::Base.deliveries.size }, 1 do
      post "/api/v1/order_status_check_comment_mails/#{comment.id}/resend",
           headers: auth_headers(@admin),
           as: :json
    end

    assert_response :ok
    assert comment.reload.sent?
  end

  # 異常系: 代表者のメールアドレスが未設定の場合は再送信できない。
  test 'fails to resend when representative email is blank' do
    @representative.update!(email: '')
    comment = @group.comments.create!(
      subject: '再提出依頼: 技大祭企画',
      body: '食品名を修正してください。',
      mail_delivery_status: :failed
    )

    assert_no_difference -> { ActionMailer::Base.deliveries.size } do
      post "/api/v1/order_status_check_comment_mails/#{comment.id}/resend",
           headers: auth_headers(@admin),
           as: :json
    end

    assert_response :unprocessable_entity
    assert_not comment.reload.sent?
  end

  private

  def valid_params
    {
      group_id: @group.id,
      subject: '再提出依頼: 技大祭企画',
      body: '食品名を修正してください。'
    }
  end

  def create_user!(email:, role_id:)
    User.create!(
      name: 'テストユーザー',
      email: email,
      provider: 'google_oauth2',
      uid: email,
      password: 'password',
      password_confirmation: 'password',
      role_id: role_id
    )
  end

  def auth_headers(user)
    user.create_new_auth_token
  end
end
