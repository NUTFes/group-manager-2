# frozen_string_literal: true

require 'test_helper'

class Api::V1::HealthCenterSubmissionStatusCommentMailTest < ActionDispatch::IntegrationTest
  self.fixture_table_names = []

  setup do
    @original_gmail_address = ENV.fetch('GMAIL_ADDRESS', nil)
    ENV['GMAIL_ADDRESS'] = 'no-reply@example.com'
    ActionMailer::Base.deliveries.clear

    Role.create!(id: 1, name: 'admin')
    Role.create!(id: 2, name: 'staff')
    Role.create!(id: 3, name: 'user')
    @admin = create_user!(email: 'admin-health-mail@example.com', role_id: 1)
    @staff = create_user!(email: 'staff-health-mail@example.com', role_id: 2)
    @user = create_user!(email: 'user-health-mail@example.com', role_id: 3)
    @representative = create_user!(email: 'representative@example.com', role_id: 1)
    group_category = GroupCategory.create!(name: '食品販売')
    fes_year = FesYear.create!(year_num: 2026)
    @group = Group.create!(
      name: '技大祭企画',
      project_name: '食品販売',
      activity: '食品販売',
      user: @representative,
      group_category: group_category,
      fes_year: fes_year
    )
    @template = MessageTemplate.create!(
      locale: 'ja',
      name: 'GM再提出依頼',
      subject: '再提出依頼: {group_name}',
      body: '{group_name} 代表 {user_name} 様'
    )
  end

  teardown do
    ENV['GMAIL_ADDRESS'] = @original_gmail_address
  end

  # 正常系: メモをfailedで保存後、メール送信成功時にsentへ更新する。
  test 'creates failed comment first and marks it sent when mail delivery succeeds' do
    assert_difference('Comment.count', 1) do
      assert_difference -> { ActionMailer::Base.deliveries.size }, 1 do
        post '/api/v1/create_health_center_submission_status_comment_mail',
             params: valid_params,
             headers: auth_headers(@admin),
             as: :json
      end
    end

    assert_response :created
    comment = Comment.last
    assert comment.sent?
    assert_equal 'sent', response.parsed_body['data']['mail_delivery_status']
    assert_includes comment.body, '件名: 再提出依頼: 技大祭企画'
    assert_includes comment.body, '食品名を修正してください。'
  end

  # 暫定権限の正常系。role_id 2 の staff でもメール送信付きメモを作成できることを確認する。
  test 'staff can create comment with mail delivery' do
    assert_difference('Comment.count', 1) do
      assert_difference -> { ActionMailer::Base.deliveries.size }, 1 do
        post '/api/v1/create_health_center_submission_status_comment_mail',
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
        post '/api/v1/create_health_center_submission_status_comment_mail',
             params: valid_params,
             headers: auth_headers(@user),
             as: :json
      end
    end

    assert_response :forbidden
  end

  # 異常系: メール送信で例外が発生しても、再送可能なfailedメモを残す。
  test 'keeps failed comment when mail delivery raises' do
    failing_delivery = Object.new
    def failing_delivery.deliver_now!
      raise StandardError, 'smtp failed'
    end

    original_plain_text_email = GenericMailer.method(:plain_text_email)
    GenericMailer.define_singleton_method(:plain_text_email) { |**_args| failing_delivery }
    begin
      assert_difference('Comment.count', 1) do
        assert_no_difference -> { ActionMailer::Base.deliveries.size } do
          post '/api/v1/create_health_center_submission_status_comment_mail',
               params: valid_params,
               headers: auth_headers(@admin),
               as: :json
        end
      end
    ensure
      GenericMailer.define_singleton_method(:plain_text_email, original_plain_text_email)
    end

    assert_response :bad_gateway
    comment = Comment.last
    assert comment.failed?
    assert_equal 'failed', response.parsed_body['data']['mail_delivery_status']
  end

  # 再送信: failedの保存済みメモを再送し、成功時にsentへ更新する。
  test 'resends failed comment and marks it sent' do
    submission_status = HealthCenterSubmissionStatus.create!(
      group: @group,
      application_type: :food_product,
      status: :waiting_resubmission
    )
    comment = submission_status.comments.create!(
      body: "件名: 再提出依頼: 技大祭企画\n\n食品名を修正してください。",
      mail_delivery_status: :failed
    )

    assert_difference -> { ActionMailer::Base.deliveries.size }, 1 do
      post "/api/v1/resend_health_center_submission_status_comment_mail/#{comment.id}",
           headers: auth_headers(@admin),
           as: :json
    end

    assert_response :success
    assert comment.reload.sent?
    assert_equal '再提出依頼: 技大祭企画', ActionMailer::Base.deliveries.last.subject
  end

  # 再送信の防御: 送信しない通常メモはAPIを直接叩いても再送できない。
  test 'does not resend memo comment' do
    submission_status = HealthCenterSubmissionStatus.create!(
      group: @group,
      application_type: :food_product,
      status: :waiting_resubmission
    )
    comment = submission_status.comments.create!(
      body: "件名: 再提出依頼: 技大祭企画\n\n食品名を修正してください。",
      mail_delivery_status: :memo
    )

    assert_no_difference -> { ActionMailer::Base.deliveries.size } do
      post "/api/v1/resend_health_center_submission_status_comment_mail/#{comment.id}",
           headers: auth_headers(@admin),
           as: :json
    end

    assert_response :unprocessable_entity
  end

  # 再送信の防御: 送信済みメモはAPIを直接叩いても再送できない。
  test 'does not resend sent comment' do
    submission_status = HealthCenterSubmissionStatus.create!(
      group: @group,
      application_type: :food_product,
      status: :waiting_resubmission
    )
    comment = submission_status.comments.create!(
      body: "件名: 再提出依頼: 技大祭企画\n\n食品名を修正してください。",
      mail_delivery_status: :sent
    )

    assert_no_difference -> { ActionMailer::Base.deliveries.size } do
      post "/api/v1/resend_health_center_submission_status_comment_mail/#{comment.id}",
           headers: auth_headers(@admin),
           as: :json
    end

    assert_response :unprocessable_entity
  end

  # 権限: role_id 1/2 以外は保存済みメモの再送信もできない。
  test 'general user cannot resend comment mail' do
    submission_status = HealthCenterSubmissionStatus.create!(
      group: @group,
      application_type: :food_product,
      status: :waiting_resubmission
    )
    comment = submission_status.comments.create!(
      body: "件名: 再提出依頼: 技大祭企画\n\n食品名を修正してください。",
      mail_delivery_status: :failed
    )

    assert_no_difference -> { ActionMailer::Base.deliveries.size } do
      post "/api/v1/resend_health_center_submission_status_comment_mail/#{comment.id}",
           headers: auth_headers(@user),
           as: :json
    end

    assert_response :forbidden
  end

  private

  def valid_params
    {
      group_id: @group.id,
      application_type: 'food_product',
      message_template_id: @template.id,
      body: '食品名を修正してください。'
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
