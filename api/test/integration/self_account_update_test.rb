# frozen_string_literal: true

require 'test_helper'

# 本人の情報の変更は、ロールを問わず本人なら行え、他人の分はmanagerだけが変更できることを確認する
class SelfAccountUpdateTest < ActionDispatch::IntegrationTest
  self.fixture_table_names = []

  setup do
    @manager = create_api_user(role_id: 1)
    @staff = create_api_user(role_id: 2)
    @user = create_api_user(role_id: 3)
  end

  test '本人ならどのロールでも自分のパスワードを再設定できる' do
    [@manager, @staff, @user].each do |account|
      post '/api/v1/users/reset_password', params: reset_password_params(account),
                                           headers: account.create_new_auth_token, as: :json

      assert_response :success, "role_id #{account.role_id}"
      assert account.reload.valid_password?('new-password'), "role_id #{account.role_id}"
    end
  end

  test 'userとstaffは他人のパスワードを再設定できない' do
    [@user, @staff].each do |account|
      post '/api/v1/users/reset_password', params: reset_password_params(@manager),
                                           headers: account.create_new_auth_token, as: :json

      assert_response :forbidden, "role_id #{account.role_id}"
    end
    assert_not @manager.reload.valid_password?('new-password')
  end

  test 'managerは他人のパスワードも再設定できる' do
    post '/api/v1/users/reset_password', params: reset_password_params(@user),
                                         headers: @manager.create_new_auth_token, as: :json

    assert_response :success
    assert @user.reload.valid_password?('new-password')
  end

  test 'staffはログイン中の本人のパスワードを変更できる' do
    post '/api/v1/current_user/password_reset', params: { password: 'new-password', password_confirmation: 'new-password' },
                                                headers: @staff.create_new_auth_token, as: :json

    assert_response :success
    assert @staff.reload.valid_password?('new-password')
  end

  private

  def reset_password_params(account)
    { user_id: account.id, password: 'new-password', password_confirmation: 'new-password' }
  end
end
