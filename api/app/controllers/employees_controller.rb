class EmployeesController < ApplicationController
  before_action :set_employee, only: [:show, :update, :destroy]

  # GET /employees
  # GET /employees.json
  def index
    @employees = Employee.all
    render json: fmt(ok, @employees)
  end

  # GET /employees/1
  # GET /employees/1.json
  def show
    render json: fmt(ok, @employee)
  end

  # POST /employees
  # POST /employees.json
  def create
    @employee = Employee.create(employee_params)
    render json: fmt(created, @employee)
  end

  # PATCH/PUT /employees/1
  # PATCH/PUT /employees/1.json
  def update
    @employee.update(employee_params)
    render json: fmt(created, @employee, "Updated employee id = "+params[:id])
  end

  # DELETE /employees/1
  # DELETE /employees/1.json
  def destroy
    @employee.destroy
    render json: fmt(ok ,[], "Deleted employee = "+params[:id])
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_employee
      if Employee.exists?(params[:id])
        @employee = Employee.find(params[:id])
      else
        render json: fmt(not_found, [], "Not found employee = "+params[:id])
      end  
    end

    # Only allow a list of trusted parameters through.
    def employee_params
      params.permit(:group_id, :name, :student_id, :stool_test_id)
    end
end
