class Api::V1::EmployeesApiController < ApplicationController

  def get_employees
    # 従業員の一覧を取得する
    employees = Employee.all
    employees_list = []
    for employee in employees
      group = employee.group.name
      employees_list << {
        employee: employee,
        group: group,
      }
    end
    render json: employees_list
  end

  def get_employee
    # 従業員の詳細を取得する
    employee = Employee.find(params[:id])
    employees_list = []
    group = employee.group.name
    employees_list = {
      employee: employee,
      group: group,
    }
    render json: employees_list
  end

  # 絞り込み機能
  def get_refinement_employees
    fes_year_id = params[:fes_year_id].to_i
    group_id = params[:group_id].to_i
    # 両方ともALL
    if fes_year_id == 0 && group_id == 0
      @employees = Employee.all
      #fes_year_idだけ指定
    elsif fes_year_id != 0 && group_id == 0 
      @employees = Group.where(fes_year_id: fes_year_id).preload(:employees).map{ |group| group.employees }
      #rental_item_idだけ指定
    elsif fes_year_id == 0 && group_id != 0
      @employees = Employee.where(group_id: group_id)
      #両方とも指定
    else
      @employees = Group.where(fes_year_id: fes_year_id).preload(:employees).map{ |group| group.employees.where(group_id: group_id) }  
    end

    if @employees.count == 0
      render json: fmt(not_found, [], "Not found empolees")
    else 
      render json: fmt(ok, @employees)
    end
  end

  #あいまい検索
  def get_search_employees
    word = params[:word]
    @employees = Group.where("name like ?", "%#{word}%").preload(:employees).map{ |group| group.employees } 
    if @employees.count == 0
      render json: fmt(not_found, [], "Not found employees")
    else
      render json: fmt(ok, @employees)
    end
  end

end
