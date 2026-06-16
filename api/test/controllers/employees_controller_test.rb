# frozen_string_literal: true

require 'test_helper'

class EmployeesControllerTest < ActionDispatch::IntegrationTest
  setup do
    @employee = employees(:one)
  end

  test 'should get index' do
    get employees_url, as: :json
    assert_response :success
  end

  test 'should create employee' do
    assert_no_difference('Employee.count') do
      post employees_url, params: { group_id: @employee.group_id, name: @employee.name, student_id: @employee.student_id, stool_test_id: @employee.stool_test_id }, as: :json
    end

    assert_response :unauthorized
  end

  test 'should show employee' do
    get employee_url(@employee), as: :json
    assert_response :success
  end

  test 'should update employee' do
    patch employee_url(@employee), params: { group_id: @employee.group_id, name: @employee.name, student_id: @employee.student_id, stool_test_id: @employee.stool_test_id }, as: :json
    assert_response :unauthorized
  end

  test 'should destroy employee' do
    assert_no_difference('Employee.count') do
      delete employee_url(@employee), as: :json
    end

    assert_response :unauthorized
  end
end
