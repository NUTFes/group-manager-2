# frozen_string_literal: true

class EmployeesController < ApplicationController
  before_action :authenticate_api_user!, except: %i[index show get_by_group]
  before_action :set_employee, only: %i[show update destroy]

  # GET /employees
  # GET /employees.json
  def index
    @employees = participant_scope(Employee)
    render json: fmt(ok, @employees)
  end

  # GET /employees/1
  # GET /employees/1.json
  def show
    render json: fmt(ok, @employee)
  end

  # GET /employees/group/:group_id
  def get_by_group
    group = current_api_user_group!(params[:group_id])
    return unless group

    @employees = Employee.where(group_id: group.id)
    render json: fmt(ok, @employees)
  end

  # POST /employees
  # POST /employees.json
  def create
    group = current_api_user_group!(employee_params[:group_id])
    return unless group

    @employee = Employee.create(employee_params.merge(group_id: group.id))
    render json: fmt(created, @employee)
  end

  # POST /employees/upsert
  # POST /employees/upsert.json
  def upsert
    now = Time.current
    records = employees_params
    return render_employee_not_found unless participant_employee_params?(records)

    records = records.map do |attrs|
      attrs[:id] ||= nil
      attrs[:created_at] ||= now
      attrs[:updated_at] = now
      attrs
    end

    Employee.upsert_all(records)

    # より正確な検索条件を構築
    scopes = records.map do |attrs|
      if attrs[:id].present?
        participant_scope(Employee).where(id: attrs[:id])
      else
        participant_scope(Employee).where(
          group_id: attrs[:group_id],
          name: attrs[:name],
          student_id: attrs[:student_id],
          stool_test_id: attrs[:stool_test_id]
        )
      end
    end
    processed = scopes.reduce(Employee.none, &:or)

    render json: fmt(ok, processed)
  rescue ActiveRecord::StatementInvalid => e
    render json: fmt(unprocessable_entity, [], e.message), status: :unprocessable_entity
  end

  # PATCH/PUT /employees/1
  # PATCH/PUT /employees/1.json
  def update
    attrs = employee_params
    return if attrs[:group_id].present? && !current_api_user_group!(attrs[:group_id])

    if @employee.update(attrs)
      render json: fmt(ok, @employee, "Updated employee id = #{params[:id]}")
    else
      render json: fmt(unprocessable_entity, [], @employee.errors.full_messages.join(', ')), status: :unprocessable_entity
    end
  end

  # DELETE /employees/1
  # DELETE /employees/1.json
  def destroy
    @employee.destroy
    render json: fmt(ok, [], "Deleted employee = #{params[:id]}")
  end

  private

  def set_employee
    @employee = participant_record!(Employee, params[:id])
  end

  # 単一レコード用 Strong Parameters
  def employee_params
    params.permit(:group_id, :name, :student_id, :stool_test_id)
  end

  # 複数レコード用 Strong Parameters
  def employees_params
    params.require(:employees).map do |emp|
      ActionController::Parameters
        .new(emp.to_unsafe_h)
        .permit(:id, :group_id, :name, :student_id, :stool_test_id)
        .to_h
        .symbolize_keys
    end
  end

  def participant_employee_params?(records)
    records.all? do |attrs|
      current_api_user.groups.exists?(id: attrs[:group_id]) &&
        (attrs[:id].blank? || participant_scope(Employee).exists?(id: attrs[:id]))
    end
  end

  def render_employee_not_found
    render json: fmt(not_found, [], 'Not Found'), status: :not_found
  end
end
