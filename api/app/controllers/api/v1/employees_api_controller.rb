# frozen_string_literal: true

class Api::V1::EmployeesApiController < Api::V1::StaffController
  def get_employee_index_for_admin_view
    @employees = Employee.with_groups
    render json: fmt(ok, @employees)
  end

  def get_employee_show_for_admin_view
    @employee = Employee.with_group(params[:id])
    render json: fmt(ok, @employee)
  end

  def fit_employee_index_for_admin_view(employees)
    employees.map do |employee|
      {
        employee: employee,
        group: employee.group,
        stool_test: employee.stool_test
      }
    end
  end

  # 絞り込み機能
  def get_refinement_employees
    fes_year_id = params[:fes_year_id].to_i
    # 指定なし
    @employees = if fes_year_id == 0
                   Employee.all
                 # fes_year_id指定
                 else
                   Employee.preload(:group).select { |employee| employee.group.fes_year_id == fes_year_id }
                 end

    if @employees.none?
      render json: fmt(not_found, [], 'Not found empolees')
    else
      render json: fmt(ok, fit_employee_index_for_admin_view(@employees))
    end
  end

  # あいまい検索
  def get_search_employees
    word = params[:word]
    @employees = Employee.all.select { |employee| employee.group.name.include?(word) || employee.name.include?(word) }
    if @employees.none?
      render json: fmt(not_found, [], 'Not found employees')
    else
      render json: fmt(ok, fit_employee_index_for_admin_view(@employees))
    end
  end

  # admin_view: staff/managerが任意団体の従業員を作成・編集・削除するためのエンドポイント
  # (共有の EmployeesController は current_api_user.groups にスコープされるため専用に用意する)
  def create_employee_for_admin_view
    @employee = Employee.new(employee_params)
    if @employee.save
      render json: fmt(created, @employee)
    else
      render_validation_errors(@employee)
    end
  end

  def update_employee_for_admin_view
    @employee = Employee.find_by(id: params[:id])
    return render json: fmt(not_found, [], 'Not Found'), status: :not_found unless @employee

    if @employee.update(employee_params)
      render json: fmt(ok, @employee, "Updated employee id = #{params[:id]}")
    else
      render_validation_errors(@employee)
    end
  end

  def delete_employee_for_admin_view
    @employee = Employee.find_by(id: params[:id])
    return render json: fmt(not_found, [], 'Not Found'), status: :not_found unless @employee

    @employee.destroy
    render json: fmt(ok, [], "Deleted employee = #{params[:id]}")
  end

  private

  def employee_params
    params.permit(:group_id, :name, :student_id, :stool_test_id)
  end
end
