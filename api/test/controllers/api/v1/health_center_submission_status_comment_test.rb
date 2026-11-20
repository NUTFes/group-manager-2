# frozen_string_literal: true

require 'test_helper'

class Api::V1::HealthCenterSubmissionStatusCommentTest < ActionDispatch::IntegrationTest
  self.fixture_table_names = []

  setup do
    Role.create!(id: 1, name: 'admin')
    @admin = create_user!(email: 'admin-comment@example.com', role_id: 1)
    representative = create_user!(email: 'representative-comment@example.com', role_id: 1)
    group_category = GroupCategory.create!(name: '食品販売')
    fes_year = FesYear.create!(year_num: 2026)
    @group = Group.create!(
      name: '技大祭企画',
      project_name: '食品販売',
      activity: '食品販売',
      user: representative,
      group_category: group_category,
      fes_year: fes_year
    )
  end

  # 通常メモ作成: メール送信しないメモとしてmemoで保存されることを確認する。
  test 'creates a memo comment without mail delivery' do
    assert_difference -> { Comment.count }, 1 do
      post '/api/v1/create_health_center_submission_status_comment',
           params: {
             group_id: @group.id,
             application_type: 'food_product',
             subject: '確認メモ',
             body: '確認だけのメモです'
           },
           headers: auth_headers(@admin),
           as: :json
    end

    assert_response :success
    comment = Comment.last
    assert comment.memo?
    assert_equal 'memo', response.parsed_body['data']['mail_delivery_status']
    assert_equal '確認メモ', comment.subject
  end

  # 異常系: subjectが未指定の場合はメモを作成できない。
  test 'fails when subject is missing' do
    assert_no_difference -> { Comment.count } do
      post '/api/v1/create_health_center_submission_status_comment',
           params: {
             group_id: @group.id,
             application_type: 'food_product',
             body: '確認だけのメモです'
           },
           headers: auth_headers(@admin),
           as: :json
    end

    assert_response :unprocessable_entity
  end

  # 異常系: application_typeが不正な場合はメモを作成できない。
  test 'fails when application_type is invalid' do
    assert_no_difference -> { Comment.count } do
      post '/api/v1/create_health_center_submission_status_comment',
           params: {
             group_id: @group.id,
             application_type: 'invalid_type',
             subject: '確認メモ',
             body: '確認だけのメモです'
           },
           headers: auth_headers(@admin),
           as: :json
    end

    assert_response :unprocessable_entity
  end

  # 異常系: group_idが未指定の場合はメモを作成できない。
  test 'fails when group_id is missing' do
    assert_no_difference -> { Comment.count } do
      post '/api/v1/create_health_center_submission_status_comment',
           params: {
             application_type: 'food_product',
             subject: '確認メモ',
             body: '確認だけのメモです'
           },
           headers: auth_headers(@admin),
           as: :json
    end

    assert_response :unprocessable_entity
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
end
