class EmployeesController < ApplicationController
  before_action :authenticate_api_user!, except: [:index, :show, :get_by_group]
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

  # GET /employees/group/:group_id
  def get_by_group
    @employees = Employee.where(group_id: params[:group_id])
    render json: fmt(ok, @employees)
  end

  # POST /employees
  # POST /employees.json
  def create
    @employee = Employee.create(employee_params)
    render json: fmt(created, @employee)
  end

  # POST /employees/bulk
  # POST /employees/bulk.json
  def bulk_create
    created = Employee.transaction do
      employee_bulk_params.map { |attrs| Employee.create!(attrs) }
    end
    render json: fmt(created, created), status: :created
  rescue ActiveRecord::RecordInvalid => e
    render json: fmt(unprocessable_entity, [], e.record.errors.full_messages.join(', ')), status: :unprocessable_entity
  end

  # PATCH/PUT /employees/1
  # PATCH/PUT /employees/1.json
  def update
    if @employee.update(employee_params)
      render json: fmt(ok, @employee, "Updated employee id = #{params[:id]}")
    else
      render json: fmt(unprocessable_entity, [], @employee.errors.full_messages.join(', ')), status: :unprocessable_entity
    end
  end

  # PATCH/PUT /employees/bulk
  # PATCH/PUT /employees/bulk.json
  def bulk_update
    updates = employee_bulk_params(include_id: true)

    updated = Employee.transaction do
      updates.map do |attrs|
        emp = Employee.find(attrs.delete(:id))
        emp.update!(attrs)
        emp
      end
    end

    render json: fmt(ok, updated)
  rescue ActiveRecord::RecordNotFound => e
    render json: fmt(not_found, [], e.message), status: :not_found
  rescue ActiveRecord::RecordInvalid => e
    render json: fmt(unprocessable_entity, [], e.record.errors.full_messages.join(', ')), status: :unprocessable_entity
  end

  # DELETE /employees/1
  # DELETE /employees/1.json
  def destroy
    @employee.destroy
    render json: fmt(ok, [], "Deleted employee = #{params[:id]}")
  end

  private

  def set_employee
    @employee = Employee.find_by(id: params[:id])
    return if @employee

    render json: fmt(not_found, [], "Not found employee id=#{params[:id]}"), status: :not_found
  end

  # 単一レコード用 Strong Parameters
  def employee_params
    params.permit(:group_id, :name, :student_id, :stool_test_id)
  end

  # 複数レコード用 Strong Parameters
  # include_id: true で :id を許可
  def employee_bulk_params(include_id: false)
    permitted = %i[group_id name student_id stool_test_id]
    permitted << :id if include_id

    params.require(:employees).map do |emp|
      ActionController::Parameters
        .new(emp.to_unsafe_h)
        .permit(permitted)
        .to_h
        .symbolize_keys
    end
  end
end
