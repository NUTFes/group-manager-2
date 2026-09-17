# frozen_string_literal: true

require 'test_helper'

class EmployeesControllerTest < ActionDispatch::IntegrationTest
  # NOTE: 一部の既存フィクスチャ（assign_rental_items 等）が
  # スキーマと乖離しており fixtures :all のままだと setup 時点で読み込みに失敗するため、
  # このテストに必要なフィクスチャのみに限定する。
  self.fixture_table_names = %w[groups stool_tests employees]

  setup do
    @employee = employees(:one)
    Role.find_or_create_by!(name: 'admin')
    @user = User.create!(
      name: 'employee-test-user',
      email: 'employee-test-user@example.com',
      uid: 'employee-test-user@example.com',
      provider: 'email',
      password: 'password',
      password_confirmation: 'password',
      role: Role.find_by(name: 'admin')
    )
  end

  def valid_params
    { group_id: @employee.group_id, name: @employee.name, student_id: @employee.student_id, stool_test_id: @employee.stool_test_id }
  end

  def auth_headers
    @user.create_new_auth_token.merge('Content-Type' => 'application/json')
  end

  test 'should get index' do
    get employees_url, as: :json
    assert_response :success
  end

  test 'should create employee' do
    assert_difference('Employee.count') do
      post employees_url, params: valid_params, headers: auth_headers, as: :json
    end

    assert_response :ok
  end

  test 'should not create employee with invalid stool_test_id' do
    assert_no_difference('Employee.count') do
      post employees_url, params: valid_params.merge(stool_test_id: 0), headers: auth_headers, as: :json
    end

    assert_response :unprocessable_entity
    body = response.parsed_body
    assert_includes body['status']['option'], 'Stool test'
  end

  test 'should show employee' do
    get employee_url(@employee), as: :json
    assert_response :success
  end

  test 'should update employee' do
    patch employee_url(@employee), params: valid_params, headers: auth_headers, as: :json
    assert_response :ok
  end

  test 'should not update employee with invalid stool_test_id' do
    patch employee_url(@employee), params: valid_params.merge(stool_test_id: 0), headers: auth_headers, as: :json
    assert_response :unprocessable_entity
  end

  test 'should destroy employee' do
    assert_difference('Employee.count', -1) do
      delete employee_url(@employee), headers: auth_headers, as: :json
    end

    assert_response :ok
  end

  test 'create requires authentication' do
    post employees_url, params: valid_params, as: :json
    assert_response :unauthorized
  end
end
