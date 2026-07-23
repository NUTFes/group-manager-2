# frozen_string_literal: true

require 'test_helper'

class SubRepsControllerTest < ActionDispatch::IntegrationTest
  # NOTE: 一部の既存フィクスチャ（employees, assign_rental_items 等）が
  # スキーマと乖離しており fixtures :all のままだと setup 時点で読み込みに失敗するため、
  # このテストに必要なフィクスチャのみに限定する。
  self.fixture_table_names = %w[users groups departments grades sub_reps]

  setup do
    Role.find_or_create_by!(id: Role::MANAGER_ID) { |role| role.name = 'manager' }
    @sub_rep = sub_reps(:one)
    @user = users(:one)
  end

  def valid_params
    { department_id: @sub_rep.department_id, email: @sub_rep.email, grade_id: @sub_rep.grade_id, group_id: @sub_rep.group_id, name: @sub_rep.name, tel: @sub_rep.tel }
  end

  def auth_headers
    @user.create_new_auth_token.merge('Content-Type' => 'application/json')
  end

  test 'should get index' do
    get sub_reps_url, as: :json
    assert_response :success
  end

  test 'should create sub_rep' do
    assert_difference('SubRep.count') do
      post sub_reps_url, params: valid_params, headers: auth_headers, as: :json
    end

    assert_response :ok
  end

  test 'should not create sub_rep with invalid department_id' do
    assert_no_difference('SubRep.count') do
      post sub_reps_url, params: valid_params.merge(department_id: 0), headers: auth_headers, as: :json
    end

    assert_response :unprocessable_entity
    body = response.parsed_body
    assert_includes body['status']['option'], 'Department'
  end

  test 'should show sub_rep' do
    get sub_rep_url(@sub_rep), as: :json
    assert_response :success
  end

  test 'should update sub_rep' do
    patch sub_rep_url(@sub_rep), params: valid_params, headers: auth_headers, as: :json
    assert_response :ok
  end

  test 'should not update sub_rep with invalid department_id' do
    patch sub_rep_url(@sub_rep), params: valid_params.merge(department_id: 0), headers: auth_headers, as: :json
    assert_response :unprocessable_entity
  end

  test 'should destroy sub_rep' do
    assert_difference('SubRep.count', -1) do
      delete sub_rep_url(@sub_rep), headers: auth_headers, as: :json
    end

    assert_response :ok
  end

  test 'create requires authentication' do
    post sub_reps_url,
         params: valid_params,
         headers: { 'Content-Type' => 'application/json' },
         as: :json
    assert_response :unauthorized
  end
end
