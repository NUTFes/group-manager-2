class Api::V1::EmployeesApiController < ApplicationController

  def get_employee_index_for_admin_view
    @employees = Employee.with_groups
    render json: fmt(ok, @employees)
  end

  def get_employee_show_for_admin_view
    @employee = Employee.with_group(params[:id])
    render json: fmt(ok, @employee)
  end

end
