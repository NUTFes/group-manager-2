# frozen_string_literal: true

require 'test_helper'

class Api::Auth::RegistrationsControllerTest < ActionDispatch::IntegrationTest
  self.fixture_table_names = []

  setup do
    ensure_role(1)
    ensure_role(3)
  end

  test '新規登録でrole_idを送っても参加団体ユーザー（role_id 3）として登録される' do
    post '/api/auth', params: {
      registration: {
        name: '登録ユーザー', email: 'signup-role@example.com',
        password: 'password', password_confirmation: 'password', role_id: 1
      }
    }, as: :json

    assert_response :success
    assert_equal 3, User.find_by(email: 'signup-role@example.com').role_id
  end

  test 'アカウント更新でrole_idを送っても自分のロールは変わらない' do
    user = create_api_user(role_id: 3)

    put '/api/auth', params: { registration: { name: '更新後', role_id: 1 } },
                     headers: user.create_new_auth_token, as: :json

    assert_response :success
    assert_equal '更新後', user.reload.name
    assert_equal 3, user.role_id
  end
end
