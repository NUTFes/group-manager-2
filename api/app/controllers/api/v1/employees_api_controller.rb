class Api::V1::EmployeesApiController < ApplicationController

  def get_employee_index_for_admin_view
    @employees = Employee.with_groups
    render json: fmt(ok, @employees)
  end

  def get_employee_show_for_admin_view
    @employee = Employee.with_group(params[:id])
    render json: fmt(ok, @employee)
  end

  def fit_employee_index_for_admin_view(employees)
    employees.map{
      |employee|
      {
        "employee": employee,
        "group": employee.group,
        "stool_test": employee.stool_test
      }
    }
  end

  # 絞り込み機能
  def get_refinement_employees
    fes_year_id = params[:fes_year_id].to_i
    # 指定なし
    if fes_year_id == 0
      @employees = Employee.all
      #fes_year_id指定
    else
      @employees = Employee.preload(:group).map{ |employee| employee if employee.group.fes_year_id == fes_year_id }.compact
    end

    if @employees.count == 0
      render json: fmt(not_found, [], "Not found empolees")
    else 
      render json: fmt(ok, fit_employee_index_for_admin_view(@employees))
    end
  end

  #あいまい検索
  def get_search_employees
    word = params[:word]
    @employees = Employee.all.map{ |employee| employee if employee.group.name.include?(word) || employee.name.include?(word) }.compact
    if @employees.count == 0
      render json: fmt(not_found, [], "Not found employees")
    else
      render json: fmt(ok, fit_employee_index_for_admin_view(@employees))
    end
  end

end
